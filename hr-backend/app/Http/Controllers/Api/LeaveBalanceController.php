<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeaveBalanceController extends Controller
{
    /**
     * Obtenir les soldes de congés d'un employé
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'year' => 'nullable|integer|min:2020|max:2030',
        ]);

        $employeeId = $request->employee_id;
        $year = $request->year ?? now()->year;

        $balances = LeaveBalance::where('employee_id', $employeeId)
            ->where('year', $year)
            ->get()
            ->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'leave_type' => $balance->leave_type,
                    'year' => $balance->year,
                    'allocated_days' => $balance->allocated_days,
                    'used_days' => $balance->used_days,
                    'remaining_days' => $balance->remaining_days,
                    'carried_over_days' => $balance->carried_over_days,
                    'seniority_bonus' => $balance->seniority_bonus,
                    'period_start' => $balance->period_start,
                    'period_end' => $balance->period_end,
                    'last_calculated_at' => $balance->last_calculated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $balances,
            'employee' => Employee::find($employeeId)->only(['id', 'first_name', 'last_name']),
            'year' => $year,
        ]);
    }

    /**
     * Calculer/recalculer les soldes pour un employé
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'year' => 'required|integer|min:2020|max:2030',
            'force_recalculate' => 'boolean',
        ]);

        $employeeId = $request->employee_id;
        $year = $request->year;
        $forceRecalculate = $request->boolean('force_recalculate', false);

        try {
            // Calculer les soldes pour tous les types de congés
            $leaveTypes = ['annual', 'rtt'];
            $createdBalances = [];

            foreach ($leaveTypes as $leaveType) {
                $balance = LeaveBalance::calculateForEmployee($employeeId, $leaveType, $year, $forceRecalculate);
                if ($balance) {
                    $createdBalances[] = $balance;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Soldes calculés avec succès',
                'data' => $createdBalances,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du calcul des soldes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtenir le détail d'un solde spécifique
     */
    public function show(string $id): JsonResponse
    {
        $balance = LeaveBalance::with('employee')->find($id);

        if (!$balance) {
            return response()->json([
                'success' => false,
                'message' => 'Solde non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $balance->id,
                'employee' => $balance->employee->only(['id', 'first_name', 'last_name', 'employee_number']),
                'leave_type' => $balance->leave_type,
                'year' => $balance->year,
                'allocated_days' => $balance->allocated_days,
                'used_days' => $balance->used_days,
                'remaining_days' => $balance->remaining_days,
                'carried_over_days' => $balance->carried_over_days,
                'seniority_bonus' => $balance->seniority_bonus,
                'period_start' => $balance->period_start,
                'period_end' => $balance->period_end,
                'calculation_details' => $balance->calculation_details,
                'last_calculated_at' => $balance->last_calculated_at,
                'created_at' => $balance->created_at,
                'updated_at' => $balance->updated_at,
            ],
        ]);
    }

    /**
     * Ajuster manuellement un solde (RH uniquement)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Vérifier les permissions RH
        if (!auth()->user()->hasPermission('leave_balance.update')) {
            return response()->json([
                'success' => false,
                'message' => 'Permission insuffisante',
            ], 403);
        }

        $request->validate([
            'allocated_days' => 'nullable|numeric|min:0|max:365',
            'used_days' => 'nullable|numeric|min:0',
            'adjustment_reason' => 'required_with:allocated_days,used_days|string|max:500',
        ]);

        $balance = LeaveBalance::find($id);

        if (!$balance) {
            return response()->json([
                'success' => false,
                'message' => 'Solde non trouvé',
            ], 404);
        }

        try {
            $changes = [];
            
            if ($request->has('allocated_days')) {
                $oldAllocated = $balance->allocated_days;
                $balance->allocated_days = $request->allocated_days;
                $changes['allocated_days'] = ['old' => $oldAllocated, 'new' => $request->allocated_days];
            }

            if ($request->has('used_days')) {
                $oldUsed = $balance->used_days;
                $balance->used_days = $request->used_days;
                $changes['used_days'] = ['old' => $oldUsed, 'new' => $request->used_days];
            }

            // Recalculer le solde restant
            $balance->remaining_days = $balance->allocated_days + $balance->carried_over_days - $balance->used_days;
            $balance->last_calculated_at = now();

            // Ajouter les détails de l'ajustement
            $adjustmentDetails = $balance->calculation_details ?? [];
            $adjustmentDetails['manual_adjustments'][] = [
                'date' => now()->toDateString(),
                'user' => auth()->user()->name,
                'reason' => $request->adjustment_reason,
                'changes' => $changes,
            ];
            $balance->calculation_details = $adjustmentDetails;

            $balance->save();

            return response()->json([
                'success' => true,
                'message' => 'Solde ajusté avec succès',
                'data' => $balance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajustement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer un solde (admin uniquement)
     */
    public function destroy(string $id): JsonResponse
    {
        if (!auth()->user()->hasRole('super_admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Permission insuffisante - Admin requis',
            ], 403);
        }

        $balance = LeaveBalance::find($id);

        if (!$balance) {
            return response()->json([
                'success' => false,
                'message' => 'Solde non trouvé',
            ], 404);
        }

        // Vérifier qu'il n'y a pas de congés associés
        if ($balance->used_days > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un solde avec des congés utilisés',
            ], 400);
        }

        $balance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Solde supprimé avec succès',
        ]);
    }

    /**
     * Calculer les soldes pour tous les employés d'une année
     */
    public function calculateAll(Request $request): JsonResponse
    {
        if (!auth()->user()->hasPermission('leave_balance.create')) {
            return response()->json([
                'success' => false,
                'message' => 'Permission insuffisante',
            ], 403);
        }

        $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'force_recalculate' => 'boolean',
        ]);

        $year = $request->year;
        $forceRecalculate = $request->boolean('force_recalculate', false);

        try {
            $employees = Employee::all();
            $results = [
                'success' => 0,
                'errors' => 0,
                'details' => [],
            ];

            foreach ($employees as $employee) {
                try {
                    foreach (['annual', 'rtt'] as $leaveType) {
                        LeaveBalance::calculateForEmployee($employee->id, $leaveType, $year, $forceRecalculate);
                    }
                    $results['success']++;
                    $results['details'][] = [
                        'employee' => $employee->full_name,
                        'status' => 'success',
                    ];
                } catch (\Exception $e) {
                    $results['errors']++;
                    $results['details'][] = [
                        'employee' => $employee->full_name,
                        'status' => 'error',
                        'message' => $e->getMessage(),
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Calcul terminé: {$results['success']} succès, {$results['errors']} erreurs",
                'data' => $results,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du calcul global: ' . $e->getMessage(),
            ], 500);
        }
    }
}
