<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type',
        'year',
        'allocated_days',
        'used_days',
        'remaining_days',
        'carried_over_days',
        'seniority_bonus',
        'period_start',
        'period_end',
        'calculation_details',
        'last_calculated_at',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'calculation_details' => 'array',
        'last_calculated_at' => 'datetime',
    ];

    /**
     * Relation avec l'employé
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Calculer et créer les soldes pour un employé selon les règles Namie
     */
    public static function calculateForEmployee(int $employeeId, string $leaveType, int $year, bool $forceRecalculate = false): ?self
    {
        $employee = Employee::find($employeeId);
        if (!$employee) {
            return null;
        }

        // Vérifier s'il existe déjà un solde
        $existingBalance = self::where('employee_id', $employeeId)
            ->where('leave_type', $leaveType)
            ->where('year', $year)
            ->first();

        if ($existingBalance && !$forceRecalculate) {
            return $existingBalance;
        }

        $hireDate = Carbon::parse($employee->hire_date);
        $periodStart = Carbon::create($year, 6, 1); // 1er juin
        $periodEnd = Carbon::create($year + 1, 5, 31); // 31 mai année suivante
        
        // Si embauché après le début de la période, ajuster au prorata
        if ($hireDate->gt($periodStart)) {
            $periodStart = $hireDate;
        }

        $allocatedDays = 0;
        $seniorityBonus = 0;
        $calculationDetails = [];

        switch ($leaveType) {
            case 'annual':
                // Congés payés : 25 jours + ancienneté (2.5j tous les 5 ans, max 5j)
                $seniorityYears = $hireDate->diffInYears($periodStart);
                $seniorityBonus = floor($seniorityYears / 5) * 2.5; // 2.5j tous les 5 ans
                $seniorityBonus = min($seniorityBonus, 5); // Max 5 jours
                $allocatedDays = 25 + $seniorityBonus;
                
                $calculationDetails = [
                    'base_days' => 25,
                    'seniority_years' => $seniorityYears,
                    'seniority_bonus' => $seniorityBonus,
                    'hire_date' => $hireDate->toDateString(),
                    'calculation_date' => now()->toDateString(),
                ];
                break;

            case 'rtt':
                // RTT selon ancienneté : 8j (0-2 ans), 10j (2-5 ans), 12j (5+ ans)
                $seniorityYears = $hireDate->diffInYears($periodStart);
                if ($seniorityYears < 2) {
                    $allocatedDays = 8;
                } elseif ($seniorityYears < 5) {
                    $allocatedDays = 10;
                } else {
                    $allocatedDays = 12;
                }
                
                $calculationDetails = [
                    'seniority_years' => $seniorityYears,
                    'calculation_date' => now()->toDateString(),
                ];
                break;
        }

        // Créer ou mettre à jour le solde
        $balance = self::updateOrCreate(
            [
                'employee_id' => $employeeId,
                'leave_type' => $leaveType,
                'year' => $year,
            ],
            [
                'allocated_days' => $allocatedDays,
                'used_days' => $existingBalance ? $existingBalance->used_days : 0,
                'remaining_days' => $allocatedDays - ($existingBalance ? $existingBalance->used_days : 0),
                'carried_over_days' => 0, // TODO: Implémenter le report
                'seniority_bonus' => $seniorityBonus,
                'period_start' => $periodStart,
                'period_end' => $periodEnd,
                'calculation_details' => $calculationDetails,
                'last_calculated_at' => now(),
            ]
        );

        return $balance;
    }

    /**
     * Déduire des jours du solde
     */
    public function deductDays(float $days): bool
    {
        if ($this->remaining_days >= $days) {
            $this->used_days += $days;
            $this->remaining_days -= $days;
            $this->save();
            return true;
        }
        return false;
    }

    /**
     * Rembourser des jours au solde (en cas d'annulation)
     */
    public function refundDays(float $days): void
    {
        $this->used_days = max(0, $this->used_days - $days);
        $this->remaining_days += $days;
        $this->save();
    }

    /**
     * Calculer le report pour l'année suivante (max 5 jours)
     */
    public function calculateCarryOver(): int
    {
        if ($this->leave_type === 'annual') {
            return min($this->remaining_days, 5);
        }
        return 0;
    }

    /**
     * Vérifier si assez de solde disponible
     */
    public function hasEnoughBalance(float $requestedDays): bool
    {
        return $this->remaining_days >= $requestedDays;
    }

    /**
     * Obtenir le solde pour une période spécifique
     */
    public static function getBalance(int $employeeId, string $leaveType, int $year): ?self
    {
        return self::where('employee_id', $employeeId)
                   ->where('leave_type', $leaveType)
                   ->where('year', $year)
                   ->first();
    }

    /**
     * Créer ou mettre à jour le solde
     */
    public static function updateOrCreateBalance(int $employeeId, string $leaveType, int $year, array $data): self
    {
        return self::updateOrCreate(
            [
                'employee_id' => $employeeId,
                'leave_type' => $leaveType,
                'year' => $year,
            ],
            array_merge($data, [
                'remaining_days' => $data['allocated_days'] - ($data['used_days'] ?? 0),
                'last_calculated_at' => now(),
            ])
        );
    }

    /**
     * Scope pour l'année courante
     */
    public function scopeCurrentYear($query)
    {
        $currentYear = now()->month >= 6 ? now()->year : now()->year - 1;
        return $query->where('year', $currentYear);
    }

    /**
     * Scope par type de congé
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('leave_type', $type);
    }
}
