<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class DepartmentController extends Controller
{
    /**
     * Afficher la liste des départements
     */
    public function index(): JsonResponse
    {
        try {
            $departments = Department::with(['manager', 'employees'])
                ->withCount('employees')
                ->orderBy('name')
                ->get()
                ->map(function ($dept) {
                    return [
                        'id' => $dept->id,
                        'name' => $dept->name,
                        'code' => $dept->code,
                        'description' => $dept->description,
                        'manager' => $dept->manager ? [
                            'id' => $dept->manager->id,
                            'name' => $dept->manager->first_name . ' ' . $dept->manager->last_name,
                            'email' => $dept->manager->email
                        ] : null,
                        'location' => $dept->location,
                        'budget' => $dept->budget,
                        'formatted_budget' => $dept->formatted_budget,
                        'employee_count' => $dept->employees_count,
                        'is_active' => $dept->is_active,
                        'created_at' => $dept->created_at,
                        'updated_at' => $dept->updated_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $departments,
                'message' => 'Départements récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des départements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouveau département
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments,name',
                'description' => 'nullable|string',
                'manager_id' => 'nullable|exists:employees,id',
                'location' => 'nullable|string|max:255',
                'budget' => 'nullable|numeric|min:0',
                'metadata' => 'nullable|array',
                'department_type' => 'nullable|string|in:operationnel,support,direction,commercial,technique',
                'target_headcount' => 'nullable|integer|min:1',
                'objectives' => 'nullable|string',
                'key_skills' => 'nullable|string|max:500'
            ]);

            // Générer automatiquement le code si non fourni
            if (!isset($validated['code'])) {
                $validated['code'] = Department::generateCode($validated['name']);
            }

            $department = Department::create($validated);

            // Charger les relations pour la réponse
            $department->load(['manager', 'employees']);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'code' => $department->code,
                    'description' => $department->description,
                    'manager' => $department->manager ? [
                        'id' => $department->manager->id,
                        'name' => $department->manager->first_name . ' ' . $department->manager->last_name,
                        'email' => $department->manager->email
                    ] : null,
                    'location' => $department->location,
                    'budget' => $department->budget,
                    'formatted_budget' => $department->formatted_budget,
                    'employee_count' => $department->employees->count(),
                    'is_active' => $department->is_active,
                    'created_at' => $department->created_at,
                    'updated_at' => $department->updated_at
                ],
                'message' => 'Département créé avec succès'
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
                'message' => 'Erreur lors de la création du département',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un département spécifique
     */
    public function show(Department $department): JsonResponse
    {
        try {
            $department->load(['manager', 'employees']);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'code' => $department->code,
                    'description' => $department->description,
                    'manager' => $department->manager ? [
                        'id' => $department->manager->id,
                        'name' => $department->manager->first_name . ' ' . $department->manager->last_name,
                        'email' => $department->manager->email
                    ] : null,
                    'location' => $department->location,
                    'budget' => $department->budget,
                    'formatted_budget' => $department->formatted_budget,
                    'employees' => $department->employees->map(function ($emp) {
                        return [
                            'id' => $emp->id,
                            'name' => $emp->first_name . ' ' . $emp->last_name,
                            'email' => $emp->email,
                            'position' => $emp->position,
                            'hire_date' => $emp->hire_date
                        ];
                    }),
                    'employee_count' => $department->employees->count(),
                    'is_active' => $department->is_active,
                    'metadata' => $department->metadata,
                    'created_at' => $department->created_at,
                    'updated_at' => $department->updated_at
                ],
                'message' => 'Département récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du département',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un département
     */
    public function update(Request $request, Department $department): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:departments,name,' . $department->id,
                'description' => 'nullable|string',
                'manager_id' => 'nullable|exists:employees,id',
                'location' => 'nullable|string|max:255',
                'budget' => 'nullable|numeric|min:0',
                'is_active' => 'sometimes|boolean',
                'metadata' => 'nullable|array',
                'department_type' => 'nullable|string|in:operationnel,support,direction,commercial,technique',
                'target_headcount' => 'nullable|integer|min:1',
                'objectives' => 'nullable|string',
                'key_skills' => 'nullable|string|max:500'
            ]);

            // Régénérer le code si le nom change
            if (isset($validated['name']) && $validated['name'] !== $department->name) {
                $validated['code'] = Department::generateCode($validated['name']);
            }

            $department->update($validated);

            // Charger les relations pour la réponse
            $department->load(['manager', 'employees']);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'code' => $department->code,
                    'description' => $department->description,
                    'manager' => $department->manager ? [
                        'id' => $department->manager->id,
                        'name' => $department->manager->first_name . ' ' . $department->manager->last_name,
                        'email' => $department->manager->email
                    ] : null,
                    'location' => $department->location,
                    'budget' => $department->budget,
                    'formatted_budget' => $department->formatted_budget,
                    'employee_count' => $department->employees->count(),
                    'is_active' => $department->is_active,
                    'created_at' => $department->created_at,
                    'updated_at' => $department->updated_at
                ],
                'message' => 'Département mis à jour avec succès'
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
                'message' => 'Erreur lors de la mise à jour du département',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un département
     */
    public function destroy(Department $department): JsonResponse
    {
        try {
            // Vérifier si le département peut être supprimé
            if (!$department->canBeDeleted()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer ce département car il contient encore des employés'
                ], 400);
            }

            $department->delete();

            return response()->json([
                'success' => true,
                'message' => 'Département supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du département',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assigner un employé à un département
     */
    public function assignEmployee(Request $request, Department $department): JsonResponse
    {
        try {
            $validated = $request->validate([
                'employee_id' => 'required|exists:employees,id'
            ]);

            $employee = Employee::findOrFail($validated['employee_id']);
            
            // Mettre à jour le département de l'employé
            $employee->update([
                'department_id' => $department->id,
                'department' => $department->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Employé assigné au département avec succès',
                'data' => [
                    'employee' => [
                        'id' => $employee->id,
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $employee->email,
                        'position' => $employee->position
                    ],
                    'department' => [
                        'id' => $department->id,
                        'name' => $department->name,
                        'code' => $department->code
                    ]
                ]
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
                'message' => 'Erreur lors de l\'assignation de l\'employé',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}