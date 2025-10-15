<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'start_date',
        'end_date',
        'days_requested',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'comments',
        // Phase 2 extensions
        'approval_level',
        'hr_approved_by',
        'hr_approved_at',
        'hr_comments',
        'requires_hr_approval',
        'advance_notice_days',
        'is_summer_period',
        'is_emergency_leave',
        'deducted_balance',
        'balance_breakdown',
        'rule_validations',
        'leave_year',
        'crosses_periods',
        'working_days',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
        // Phase 2 extensions
        'hr_approved_at' => 'datetime',
        'requires_hr_approval' => 'boolean',
        'is_summer_period' => 'boolean',
        'is_emergency_leave' => 'boolean',
        'crosses_periods' => 'boolean',
        'deducted_balance' => 'decimal:2',
        'balance_breakdown' => 'array',
        'rule_validations' => 'array',
    ];

    // Relations
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    /**
     * Relation avec l'utilisateur RH qui a approuvé
     */
    public function hrApprover()
    {
        return $this->belongsTo(User::class, 'hr_approved_by');
    }

    /**
     * Créer une demande de congé avec validation complète
     */
    public static function createRequest(array $data): self
    {
        // Valider selon les règles métier
        $validation = LeaveRule::validateLeaveRequest($data);
        
        if (!$validation['valid']) {
            throw new \Exception('Demande invalide: ' . implode(', ', $validation['errors']));
        }

        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $employee = Employee::find($data['employee_id']);
        
        // Calculer l'année de référence
        $leaveYear = $startDate->month >= 6 ? $startDate->year : $startDate->year - 1;
        
        // Vérifier si c'est dans la période d'été
        $isSummerPeriod = $startDate->month >= 7 && $startDate->month <= 8;
        
        // Calculer les jours ouvrés réels
        $period = LeavePeriod::getPeriodForYear($leaveYear);
        $workingDays = $period ? $period->getWorkingDaysBetween($startDate, $endDate) : $data['days_requested'];
        
        // Vérifier le solde disponible
        $balance = LeaveBalance::getBalance($data['employee_id'], $data['type'], $leaveYear);
        if ($balance && !$balance->hasEnoughBalance($workingDays)) {
            throw new \Exception("Solde insuffisant. Disponible: {$balance->remaining_days} jours");
        }

        $leave = self::create(array_merge($data, [
            'requires_hr_approval' => $validation['requires_hr_approval'],
            'approval_level' => $validation['requires_hr_approval'] ? 'manager' : 'manager',
            'is_summer_period' => $isSummerPeriod,
            'leave_year' => $leaveYear,
            'working_days' => $workingDays,
            'rule_validations' => $validation,
            'advance_notice_days' => now()->diffInDays($startDate),
        ]));

        // Déduire du solde si approuvé automatiquement
        if ($balance && $leave->status === 'approved') {
            $balance->deductDays($workingDays);
            $leave->update(['deducted_balance' => $workingDays]);
        }

        return $leave;
    }

    /**
     * Workflow d'approbation avancé
     */
    public function processApproval(User $approver, string $decision, ?string $comments = null): bool
    {
        if (!in_array($decision, ['approve', 'reject'])) {
            return false;
        }

        $isHR = $approver->hasRole('hr_manager') || $approver->hasRole('super_admin');
        
        if ($this->approval_level === 'manager' && !$isHR) {
            // Approbation manager
            $this->update([
                'status' => $decision === 'approve' ? 'approved' : 'rejected',
                'approved_by' => $approver->id,
                'approved_at' => now(),
                'comments' => $comments,
                'approval_level' => $this->requires_hr_approval ? 'hr' : 'completed',
            ]);

            if ($decision === 'approve' && $this->requires_hr_approval) {
                // Créer notification pour RH
                $this->notifyHRForApproval();
                return true; // En attente RH
            }
        } elseif ($this->approval_level === 'hr' && $isHR) {
            // Approbation RH finale
            $this->update([
                'status' => $decision === 'approve' ? 'approved' : 'rejected',
                'hr_approved_by' => $approver->id,
                'hr_approved_at' => now(),
                'hr_comments' => $comments,
                'approval_level' => 'completed',
            ]);
        }

        // Déduire du solde si approuvé
        if ($decision === 'approve' && $this->status === 'approved') {
            $this->deductFromBalance();
        }

        return true;
    }

    /**
     * Déduire du solde de congés
     */
    private function deductFromBalance(): void
    {
        $balance = LeaveBalance::getBalance($this->employee_id, $this->type, $this->leave_year);
        if ($balance && $balance->deductDays($this->working_days)) {
            $this->update([
                'deducted_balance' => $this->working_days,
                'balance_breakdown' => [
                    'balance_before' => $balance->remaining_days + $this->working_days,
                    'deducted' => $this->working_days,
                    'balance_after' => $balance->remaining_days,
                ],
            ]);
        }
    }

    /**
     * Notifier RH pour approbation
     */
    private function notifyHRForApproval(): void
    {
        $hrUsers = User::whereHas('roles', function($q) {
            $q->whereIn('name', ['hr_manager', 'super_admin']);
        })->get();

        foreach ($hrUsers as $hrUser) {
            Notification::create([
                'user_id' => $hrUser->id,
                'type' => 'leave_hr_approval',
                'title' => 'Approbation RH requise',
                'message' => "Demande de congé de {$this->employee->full_name} nécessite votre approbation",
                'priority' => 'normal',
                'data' => [
                    'leave_id' => $this->id,
                    'employee_name' => $this->employee->full_name,
                    'leave_type' => $this->type,
                    'days' => $this->days_requested,
                    'period' => $this->start_date->format('d/m/Y') . ' - ' . $this->end_date->format('d/m/Y'),
                ],
            ]);
        }
    }

    /**
     * Annuler une demande de congé
     */
    public function cancel(User $user, string $reason): bool
    {
        if (!in_array($this->status, ['pending', 'approved'])) {
            return false;
        }

        // Rembourser le solde si déjà déduit
        if ($this->deducted_balance > 0) {
            $balance = LeaveBalance::getBalance($this->employee_id, $this->type, $this->leave_year);
            if ($balance) {
                $balance->refundDays($this->deducted_balance);
            }
        }

        $this->update([
            'status' => 'cancelled',
            'comments' => ($this->comments ? $this->comments . "\n" : '') . "Annulé par {$user->name}: {$reason}",
        ]);

        return true;
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Accesseurs
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray'
        };
    }
} 