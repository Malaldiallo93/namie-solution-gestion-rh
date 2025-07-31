<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\TimesheetController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Dashboard routes
Route::prefix('dashboard')->group(function () {
    Route::get('/metrics', [DashboardController::class, 'metrics']);
    Route::get('/attendance', [DashboardController::class, 'attendance']);
    Route::get('/department-distribution', [DashboardController::class, 'departmentDistribution']);
    Route::get('/leave-statistics', [DashboardController::class, 'leaveStatistics']);
});

// Employee routes
Route::apiResource('employees', EmployeeController::class);
Route::get('employees/department/{department}', [EmployeeController::class, 'byDepartment']);
Route::get('employees/statistics', [EmployeeController::class, 'statistics']);

// Leave routes
Route::apiResource('leaves', LeaveController::class);
Route::get('leaves/pending', [LeaveController::class, 'pending']);
Route::get('leaves/approved', [LeaveController::class, 'approved']);
Route::get('leaves/rejected', [LeaveController::class, 'rejected']);
Route::patch('leaves/{leave}/approve', [LeaveController::class, 'approve']);
Route::patch('leaves/{leave}/reject', [LeaveController::class, 'reject']);

// Timesheet routes
Route::apiResource('timesheets', TimesheetController::class);
Route::get('timesheets/today', [TimesheetController::class, 'today']);
Route::get('timesheets/this-week', [TimesheetController::class, 'thisWeek']);
Route::get('timesheets/this-month', [TimesheetController::class, 'thisMonth']);
Route::post('timesheets/{employee}/clock-in', [TimesheetController::class, 'clockIn']);
Route::post('timesheets/{employee}/clock-out', [TimesheetController::class, 'clockOut']);

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'healthy', 'timestamp' => now()]);
});

// Routes d'authentification (API uniquement pour logout et user)
Route::prefix('auth')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Auth\GoogleController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [App\Http\Controllers\Auth\GoogleController::class, 'user'])->middleware('auth:sanctum');
}); 