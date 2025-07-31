<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timesheet;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TimesheetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $timesheets = Timesheet::with(['employee'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $timesheets,
            'message' => 'Timesheets retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'clock_in' => 'nullable|date',
            'clock_out' => 'nullable|date|after:clock_in',
            'break_start' => 'nullable|date',
            'break_end' => 'nullable|date|after:break_start',
            'total_hours' => 'nullable|numeric|min:0',
            'overtime_hours' => 'nullable|numeric|min:0',
            'status' => 'required|in:present,absent,late,half_day',
            'notes' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier qu'il n'y a pas déjà un timesheet pour cet employé à cette date
        $existingTimesheet = Timesheet::where('employee_id', $request->employee_id)
            ->where('date', $request->date)
            ->first();

        if ($existingTimesheet) {
            return response()->json([
                'success' => false,
                'message' => 'Timesheet already exists for this employee on this date'
            ], 409);
        }

        $timesheet = Timesheet::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $timesheet->load('employee'),
            'message' => 'Timesheet created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $timesheet = Timesheet::with(['employee'])->find($id);

        if (!$timesheet) {
            return response()->json([
                'success' => false,
                'message' => 'Timesheet not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $timesheet,
            'message' => 'Timesheet retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $timesheet = Timesheet::find($id);

        if (!$timesheet) {
            return response()->json([
                'success' => false,
                'message' => 'Timesheet not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'clock_in' => 'nullable|date',
            'clock_out' => 'nullable|date|after:clock_in',
            'break_start' => 'nullable|date',
            'break_end' => 'nullable|date|after:break_start',
            'total_hours' => 'nullable|numeric|min:0',
            'overtime_hours' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:present,absent,late,half_day',
            'notes' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $timesheet->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $timesheet->load('employee'),
            'message' => 'Timesheet updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $timesheet = Timesheet::find($id);

        if (!$timesheet) {
            return response()->json([
                'success' => false,
                'message' => 'Timesheet not found'
            ], 404);
        }

        $timesheet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timesheet deleted successfully'
        ]);
    }

    /**
     * Get today's timesheets
     */
    public function today(): JsonResponse
    {
        $timesheets = Timesheet::today()
            ->with(['employee'])
            ->orderBy('clock_in', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $timesheets,
            'message' => 'Today\'s timesheets retrieved successfully'
        ]);
    }

    /**
     * Get this week's timesheets
     */
    public function thisWeek(): JsonResponse
    {
        $timesheets = Timesheet::thisWeek()
            ->with(['employee'])
            ->orderBy('date', 'desc')
            ->orderBy('clock_in', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $timesheets,
            'message' => 'This week\'s timesheets retrieved successfully'
        ]);
    }

    /**
     * Get this month's timesheets
     */
    public function thisMonth(): JsonResponse
    {
        $timesheets = Timesheet::thisMonth()
            ->with(['employee'])
            ->orderBy('date', 'desc')
            ->orderBy('clock_in', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $timesheets,
            'message' => 'This month\'s timesheets retrieved successfully'
        ]);
    }

    /**
     * Clock in for an employee
     */
    public function clockIn(Request $request, string $employeeId): JsonResponse
    {
        $employee = Employee::find($employeeId);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $today = now()->toDateString();
        
        // Vérifier s'il y a déjà un timesheet pour aujourd'hui
        $timesheet = Timesheet::where('employee_id', $employeeId)
            ->where('date', $today)
            ->first();

        if (!$timesheet) {
            // Créer un nouveau timesheet
            $timesheet = Timesheet::create([
                'employee_id' => $employeeId,
                'date' => $today,
                'clock_in' => now(),
                'status' => 'present'
            ]);
        } else {
            // Mettre à jour le timesheet existant
            if ($timesheet->clock_in) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee already clocked in today'
                ], 400);
            }
            
            $timesheet->update([
                'clock_in' => now(),
                'status' => 'present'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $timesheet->load('employee'),
            'message' => 'Employee clocked in successfully'
        ]);
    }

    /**
     * Clock out for an employee
     */
    public function clockOut(Request $request, string $employeeId): JsonResponse
    {
        $employee = Employee::find($employeeId);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $today = now()->toDateString();
        
        $timesheet = Timesheet::where('employee_id', $employeeId)
            ->where('date', $today)
            ->first();

        if (!$timesheet || !$timesheet->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'Employee has not clocked in today'
            ], 400);
        }

        if ($timesheet->clock_out) {
            return response()->json([
                'success' => false,
                'message' => 'Employee already clocked out today'
            ], 400);
        }

        $clockOutTime = now();
        $totalHours = $clockOutTime->diffInMinutes($timesheet->clock_in) / 60;
        $overtimeHours = max(0, $totalHours - 8); // 8 heures = journée normale

        $timesheet->update([
            'clock_out' => $clockOutTime,
            'total_hours' => $totalHours,
            'overtime_hours' => $overtimeHours
        ]);

        return response()->json([
            'success' => true,
            'data' => $timesheet->load('employee'),
            'message' => 'Employee clocked out successfully'
        ]);
    }
}
