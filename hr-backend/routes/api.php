<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\TimesheetController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuditLogController;
// Phase 2 - Nouveaux contrôleurs
use App\Http\Controllers\Api\LeaveBalanceController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\LeaveRuleController;
use App\Http\Controllers\Api\LeavePeriodController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\UserPermissionController;

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

// Department routes
Route::apiResource('departments', DepartmentController::class);
Route::post('departments/{department}/assign-employee', [DepartmentController::class, 'assignEmployee']);

// Request routes - Système unifié de demandes
Route::apiResource('requests', RequestController::class);
Route::post('requests/{request}/approve', [RequestController::class, 'approve']);
Route::post('requests/{request}/reject', [RequestController::class, 'reject']);
Route::post('requests/{request}/cancel', [RequestController::class, 'cancel']);
Route::get('requests-statistics', [RequestController::class, 'statistics']);

// User Permission routes - Gestion des permissions utilisateurs (Super Admin, Admin, RH uniquement)
Route::get('users-permissions', [UserPermissionController::class, 'index']);
Route::get('users/{user}/permissions', [UserPermissionController::class, 'show']);
Route::post('users/{user}/permissions/grant', [UserPermissionController::class, 'grantPermission']);
Route::post('users/{user}/permissions/revoke', [UserPermissionController::class, 'revokePermission']);
Route::post('users/{user}/permissions/bulk-update', [UserPermissionController::class, 'bulkUpdatePermissions']);
Route::get('available-permissions', [UserPermissionController::class, 'getAvailablePermissions']);
Route::get('permissions-statistics', [UserPermissionController::class, 'getStatistics']);

// Leave routes
Route::apiResource('leaves', LeaveController::class);
Route::get('leaves/pending', [LeaveController::class, 'pending']);
Route::get('leaves/approved', [LeaveController::class, 'approved']);
Route::get('leaves/rejected', [LeaveController::class, 'rejected']);
Route::patch('leaves/{leave}/approve', [LeaveController::class, 'approve']);
Route::patch('leaves/{leave}/reject', [LeaveController::class, 'reject']);

// Phase 2 - Routes avancées pour les congés
Route::post('leaves/validate-request', [LeaveController::class, 'validateRequest']);
Route::post('leaves/{leave}/process-approval', [LeaveController::class, 'processApproval']);
Route::post('leaves/{leave}/cancel', [LeaveController::class, 'cancel']);
Route::get('leaves/pending-hr-approval', [LeaveController::class, 'pendingHrApproval']);

// Phase 2 - Gestion des soldes de congés
Route::apiResource('leave-balances', LeaveBalanceController::class);
Route::post('leave-balances/calculate-all', [LeaveBalanceController::class, 'calculateAll']);

// Phase 2 - Gestion des absences
Route::apiResource('absences', AbsenceController::class);
Route::post('absences/{absence}/upload-justification', [AbsenceController::class, 'uploadJustification']);
Route::get('absences/requires-attention', [AbsenceController::class, 'requiresAttention']);
Route::get('absences/statistics', [AbsenceController::class, 'statistics']);

// Phase 2 - Gestion des règles de congés (Admin/RH)
Route::apiResource('leave-rules', LeaveRuleController::class);

// Phase 2 - Gestion des périodes de référence (Admin/RH)
Route::apiResource('leave-periods', LeavePeriodController::class);

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

// Administration routes (réservées aux super admins)
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::apiResource('roles', RoleController::class);
    Route::get('audit-logs', [AuditLogController::class, 'index']);
    Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show']);
});

// Notification routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
});

// Routes d'authentification
Route::prefix('auth')->group(function () {
    // Inscription
    Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);
    Route::get('/roles', [App\Http\Controllers\Auth\RegisterController::class, 'getRoles']);
    
    // Authentification existante
    Route::post('/logout', [App\Http\Controllers\Auth\GoogleController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [App\Http\Controllers\Auth\GoogleController::class, 'user'])->middleware('auth:sanctum');
}); 