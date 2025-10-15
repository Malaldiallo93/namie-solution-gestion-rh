<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $leaves = Leave::with(['employee', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaves,
            'message' => 'Leaves retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:annual,sick,personal,maternity,paternity,unpaid',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days_requested' => 'required|integer|min:1',
            'reason' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Utiliser la nouvelle méthode avec validation complète
            $leave = Leave::createRequest($request->all());

            return response()->json([
                'success' => true,
                'data' => $leave->load(['employee', 'approver', 'hrApprover']),
                'message' => 'Demande de congé créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $leave = Leave::with(['employee', 'approver'])->find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $leave,
            'message' => 'Leave request retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|in:annual,sick,personal,maternity,paternity,unpaid',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'days_requested' => 'sometimes|required|integer|min:1',
            'reason' => 'sometimes|required|string|max:1000',
            'status' => 'sometimes|required|in:pending,approved,rejected',
            'comments' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $leave->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $leave->load(['employee', 'approver']),
            'message' => 'Leave request updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        $leave->delete();

        return response()->json([
            'success' => true,
            'message' => 'Leave request deleted successfully'
        ]);
    }

    /**
     * Get pending leave requests
     */
    public function pending(): JsonResponse
    {
        $leaves = Leave::pending()
            ->with(['employee', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaves,
            'message' => 'Pending leave requests retrieved successfully'
        ]);
    }

    /**
     * Get approved leave requests
     */
    public function approved(): JsonResponse
    {
        $leaves = Leave::approved()
            ->with(['employee', 'approver'])
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaves,
            'message' => 'Approved leave requests retrieved successfully'
        ]);
    }

    /**
     * Get rejected leave requests
     */
    public function rejected(): JsonResponse
    {
        $leaves = Leave::rejected()
            ->with(['employee', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaves,
            'message' => 'Rejected leave requests retrieved successfully'
        ]);
    }

    /**
     * Approve a leave request
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        if ($leave->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request is not pending'
            ], 400);
        }

        $leave->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id ?? 1, // Fallback to admin user
            'approved_at' => now(),
            'comments' => $request->input('comments')
        ]);

        return response()->json([
            'success' => true,
            'data' => $leave->load(['employee', 'approver']),
            'message' => 'Leave request approved successfully'
        ]);
    }

    /**
     * Reject a leave request
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        if ($leave->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request is not pending'
            ], 400);
        }

        $leave->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id ?? 1, // Fallback to admin user
            'approved_at' => now(),
            'comments' => $request->input('comments')
        ]);

        return response()->json([
            'success' => true,
            'data' => $leave->load(['employee', 'approver']),
            'message' => 'Leave request rejected successfully'
        ]);
    }

    /**
     * Workflow d'approbation avancé Phase 2
     */
    public function processApproval(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'decision' => 'required|in:approve,reject',
            'comments' => 'nullable|string|max:1000',
        ]);

        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de congé non trouvée',
            ], 404);
        }

        try {
            $success = $leave->processApproval(auth()->user(), $request->decision, $request->comments);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Approbation traitée avec succès',
                    'data' => $leave->fresh(['employee', 'approver', 'hrApprover']),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors du traitement de l\'approbation',
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Annuler une demande de congé
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de congé non trouvée',
            ], 404);
        }

        try {
            $success = $leave->cancel(auth()->user(), $request->reason);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Demande de congé annulée avec succès',
                    'data' => $leave->fresh(['employee', 'approver', 'hrApprover']),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible d\'annuler cette demande',
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtenir les demandes nécessitant une approbation RH
     */
    public function pendingHrApproval(): JsonResponse
    {
        if (!auth()->user()->hasRole(['hr_manager', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Permission insuffisante',
            ], 403);
        }

        $leaves = Leave::where('approval_level', 'hr')
            ->where('status', 'approved') // Approuvé par manager, en attente RH
            ->with(['employee', 'approver'])
            ->orderBy('approved_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaves,
            'count' => $leaves->count(),
        ]);
    }

    /**
     * Valider une demande selon les règles métier
     */
    public function validateRequest(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:annual,sick,personal,maternity,paternity,unpaid,rtt',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days_requested' => 'required|integer|min:1',
        ]);

        try {
            $validation = \App\Models\LeaveRule::validateLeaveRequest($request->all());

            return response()->json([
                'success' => true,
                'data' => $validation,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation: ' . $e->getMessage(),
            ], 500);
        }
    }
}
