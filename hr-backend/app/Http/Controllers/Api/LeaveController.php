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

        $leave = Leave::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $leave->load(['employee', 'approver']),
            'message' => 'Leave request created successfully'
        ], 201);
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
}
