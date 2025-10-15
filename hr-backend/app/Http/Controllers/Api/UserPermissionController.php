<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permission;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class UserPermissionController extends Controller
{
    /**
     * Middleware pour vérifier les permissions d'accès
     */
    public function __construct()
    {
        // TODO: Ajouter middleware d'authentification et de vérification des rôles
        // $this->middleware(['auth:sanctum', 'role:super_admin,admin,hr']);
    }

    /**
     * Obtenir tous les utilisateurs avec leurs permissions
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with(['roles', 'userPermissions.permission', 'userPermissions.grantedBy']);

            // Filtres
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Exclure les super admins sauf si l'utilisateur actuel est super admin
            // TODO: Adapter selon l'utilisateur connecté
            // if (!$currentUser->role === 'super_admin') {
            //     $query->where('role', '!=', 'super_admin');
            // }

            $users = $query->get();

            $transformedUsers = $users->map(function ($user) {
                $activePermissions = $user->userPermissions->where('granted', true)->count();
                $totalPermissions = Permission::count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'role_label' => $this->getRoleLabel($user->role),
                    'active_permissions_count' => $activePermissions,
                    'total_permissions_count' => $totalPermissions,
                    'permissions_percentage' => $totalPermissions > 0 ? round(($activePermissions / $totalPermissions) * 100) : 0,
                    'last_login' => $user->last_login_at,
                    'created_at' => $user->created_at,
                    'can_manage_permissions' => $user->canManagePermissions()
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedUsers,
                'message' => 'Utilisateurs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les permissions d'un utilisateur spécifique
     */
    public function show(User $user): JsonResponse
    {
        try {
            $permissions = $user->getAllPermissionsWithStatus();
            $groupedPermissions = collect($permissions)->groupBy('resource');

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'role_label' => $this->getRoleLabel($user->role),
                        'can_manage_permissions' => $user->canManagePermissions()
                    ],
                    'permissions' => $permissions,
                    'grouped_permissions' => $groupedPermissions,
                    'statistics' => [
                        'total' => count($permissions),
                        'granted' => collect($permissions)->where('granted', true)->count(),
                        'active' => collect($permissions)->where('active', true)->count(),
                        'revoked' => collect($permissions)->where('granted', false)->count()
                    ]
                ],
                'message' => 'Permissions utilisateur récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Accorder une permission à un utilisateur
     */
    public function grantPermission(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permission_id' => 'required|exists:permissions,id',
                'reason' => 'nullable|string|max:500',
                'expires_at' => 'nullable|date|after:now'
            ]);

            $grantedBy = 1; // TODO: Récupérer l'ID de l'utilisateur connecté
            
            $userPermission = $user->grantPermission(
                $validated['permission_id'],
                $grantedBy,
                $validated['reason'] ?? null,
                isset($validated['expires_at']) ? \Carbon\Carbon::parse($validated['expires_at']) : null
            );

            $userPermission->load(['permission', 'grantedBy']);

            return response()->json([
                'success' => true,
                'data' => $userPermission,
                'message' => 'Permission accordée avec succès'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'attribution de la permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Révoquer une permission d'un utilisateur
     */
    public function revokePermission(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permission_id' => 'required|exists:permissions,id',
                'reason' => 'required|string|max:500'
            ]);

            $revokedBy = 1; // TODO: Récupérer l'ID de l'utilisateur connecté
            
            $success = $user->revokePermission(
                $validated['permission_id'],
                $revokedBy,
                $validated['reason']
            );

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Permission révoquée avec succès'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Permission non trouvée ou déjà révoquée'
                ], 404);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la révocation de la permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour en lot les permissions d'un utilisateur
     */
    public function bulkUpdatePermissions(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*.permission_id' => 'required|exists:permissions,id',
                'permissions.*.granted' => 'required|boolean',
                'permissions.*.reason' => 'nullable|string|max:500',
                'permissions.*.expires_at' => 'nullable|date|after:now'
            ]);

            $updatedBy = 1; // TODO: Récupérer l'ID de l'utilisateur connecté
            $results = [];

            foreach ($validated['permissions'] as $permissionData) {
                if ($permissionData['granted']) {
                    $userPermission = $user->grantPermission(
                        $permissionData['permission_id'],
                        $updatedBy,
                        $permissionData['reason'] ?? null,
                        isset($permissionData['expires_at']) ? \Carbon\Carbon::parse($permissionData['expires_at']) : null
                    );
                    $results[] = ['permission_id' => $permissionData['permission_id'], 'action' => 'granted'];
                } else {
                    $success = $user->revokePermission(
                        $permissionData['permission_id'],
                        $updatedBy,
                        $permissionData['reason'] ?? 'Révocation en lot'
                    );
                    $results[] = ['permission_id' => $permissionData['permission_id'], 'action' => 'revoked', 'success' => $success];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => 'Permissions mises à jour avec succès'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour des permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir toutes les permissions disponibles
     */
    public function getAvailablePermissions(): JsonResponse
    {
        try {
            $permissions = Permission::all();
            $groupedPermissions = $permissions->groupBy('resource');

            return response()->json([
                'success' => true,
                'data' => [
                    'permissions' => $permissions,
                    'grouped_permissions' => $groupedPermissions
                ],
                'message' => 'Permissions disponibles récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des permissions
     */
    public function getStatistics(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $totalPermissions = Permission::count();
            $totalUserPermissions = UserPermission::count();
            $activeUserPermissions = UserPermission::active()->count();

            $permissionsByResource = Permission::selectRaw('resource, COUNT(*) as count')
                                              ->groupBy('resource')
                                              ->get()
                                              ->pluck('count', 'resource');

            $usersByRole = User::selectRaw('role, COUNT(*) as count')
                              ->groupBy('role')
                              ->get()
                              ->pluck('count', 'role');

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_users' => $totalUsers,
                        'total_permissions' => $totalPermissions,
                        'total_user_permissions' => $totalUserPermissions,
                        'active_user_permissions' => $activeUserPermissions,
                        'permissions_utilization' => $totalPermissions > 0 ? 
                            round(($activeUserPermissions / ($totalUsers * $totalPermissions)) * 100, 2) : 0
                    ],
                    'permissions_by_resource' => $permissionsByResource,
                    'users_by_role' => $usersByRole
                ],
                'message' => 'Statistiques récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir le libellé du rôle
     */
    private function getRoleLabel(string $role): string
    {
        return match ($role) {
            'super_admin' => 'Super Administrateur',
            'admin' => 'Administrateur',
            'hr' => 'Ressources Humaines',
            'manager' => 'Manager',
            'employee' => 'Employé',
            default => ucfirst($role)
        };
    }
}