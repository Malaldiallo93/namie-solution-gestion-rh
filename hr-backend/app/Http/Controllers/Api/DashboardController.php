<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Leave;
use App\Models\Timesheet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get HR dashboard metrics
     */
    public function metrics(): JsonResponse
    {
        $metrics = [
            'employees' => [
                'total' => Employee::count(),
                'active' => Employee::where('status', 'active')->count(),
                'new_this_month' => Employee::whereMonth('hire_date', now()->month)->count(),
                'by_department' => Employee::selectRaw('department, COUNT(*) as count')
                    ->groupBy('department')
                    ->get()
            ],
            'attendance' => [
                'present_today' => Timesheet::today()->where('status', 'present')->count(),
                'absent_today' => Timesheet::today()->where('status', 'absent')->count(),
                'late_today' => Timesheet::today()->where('status', 'late')->count(),
                'remote_workers' => Employee::where('status', 'active')->count() - Timesheet::today()->where('status', 'present')->count()
            ],
            'leaves' => [
                'pending' => Leave::pending()->count(),
                'approved_this_month' => Leave::approved()->whereMonth('start_date', now()->month)->count(),
                'sick_leaves' => Leave::where('type', 'sick')->where('status', 'approved')->count()
            ],
            'timesheets' => [
                'total_hours_this_week' => Timesheet::thisWeek()->sum('total_hours'),
                'overtime_hours_this_week' => Timesheet::thisWeek()->sum('overtime_hours'),
                'average_hours_per_day' => Timesheet::thisWeek()->avg('total_hours')
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $metrics,
            'message' => 'Dashboard metrics retrieved successfully'
        ]);
    }

    /**
     * Get attendance data for charts
     */
    public function attendance(): JsonResponse
    {
        $attendance = Timesheet::selectRaw('date, COUNT(*) as total, 
            SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late')
            ->whereBetween('date', [now()->subDays(7), now()])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'message' => 'Attendance data retrieved successfully'
        ]);
    }

    /**
     * Get department distribution
     */
    public function departmentDistribution(): JsonResponse
    {
        $distribution = Employee::selectRaw('department, COUNT(*) as count')
            ->where('status', 'active')
            ->groupBy('department')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $distribution,
            'message' => 'Department distribution retrieved successfully'
        ]);
    }

    /**
     * Get leave statistics
     */
    public function leaveStatistics(): JsonResponse
    {
        $stats = [
            'by_type' => Leave::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->get(),
            'by_status' => Leave::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get(),
            'monthly_trend' => Leave::selectRaw('MONTH(start_date) as month, COUNT(*) as count')
                ->whereYear('start_date', now()->year)
                ->groupBy('month')
                ->orderBy('month')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Leave statistics retrieved successfully'
        ]);
    }
}
