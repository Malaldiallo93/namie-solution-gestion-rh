<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'company' => 'required|string|max:255',
            'role' => 'required|string|in:super_admin,hr_manager,hr_assistant,manager,employee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->firstName . ' ' . $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(), // Auto-vérifier pour simplifier
            ]);

            // Assigner le rôle
            $role = Role::where('name', $request->role)->first();
            if ($role) {
                $user->roles()->attach($role->id, [
                    'assigned_at' => now(),
                    'assigned_by' => $user->id, // Auto-assignation
                ]);
            }

            // Générer un token d'authentification
            $token = $user->createToken('registration-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'firstName' => $request->firstName,
                        'lastName' => $request->lastName,
                        'company' => $request->company,
                        'role' => $request->role,
                        'avatar' => $user->avatar,
                    ],
                    'token' => $token,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir la liste des rôles disponibles pour l'inscription
     */
    public function getRoles(): JsonResponse
    {
        $roles = Role::select('name', 'display_name', 'description')
            ->where('is_system_role', true)
            ->get()
            ->map(function ($role) {
                return [
                    'value' => $role->name,
                    'label' => $role->display_name,
                    'description' => $role->description,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}