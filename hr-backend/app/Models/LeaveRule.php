<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class LeaveRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_type',
        'rule_name',
        'description',
        'max_consecutive_days',
        'advance_notice_days',
        'requires_hr_approval',
        'requires_manager_approval',
        'max_per_year',
        'seasonal_restrictions',
        'blackout_periods',
        'requires_medical_certificate',
        'medical_certificate_after_days',
        'is_active',
    ];

    protected $casts = [
        'requires_hr_approval' => 'boolean',
        'requires_manager_approval' => 'boolean',
        'seasonal_restrictions' => 'array',
        'blackout_periods' => 'array',
        'requires_medical_certificate' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Valider une demande de congé selon les règles
     */
    public static function validateLeaveRequest(array $requestData): array
    {
        $errors = [];
        $warnings = [];
        $leaveType = $requestData['type'];
        $startDate = Carbon::parse($requestData['start_date']);
        $endDate = Carbon::parse($requestData['end_date']);
        $daysRequested = $requestData['days_requested'];
        $employeeId = $requestData['employee_id'];

        // Récupérer les règles pour ce type de congé
        $rules = self::where('leave_type', $leaveType)
                    ->where('is_active', true)
                    ->get();

        foreach ($rules as $rule) {
            $validation = $rule->validateRequest($startDate, $endDate, $daysRequested, $employeeId);
            $errors = array_merge($errors, $validation['errors']);
            $warnings = array_merge($warnings, $validation['warnings']);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings,
            'requires_hr_approval' => self::requiresHrApproval($leaveType, $daysRequested, $startDate, $endDate),
        ];
    }

    /**
     * Valider une demande selon cette règle spécifique
     */
    public function validateRequest(Carbon $startDate, Carbon $endDate, int $daysRequested, int $employeeId): array
    {
        $errors = [];
        $warnings = [];

        // Vérifier les jours consécutifs maximum
        if ($this->max_consecutive_days && $daysRequested > $this->max_consecutive_days) {
            $errors[] = "Maximum {$this->max_consecutive_days} jours consécutifs autorisés pour {$this->leave_type}";
        }

        // Vérifier le préavis
        $advanceNoticeDays = $this->advance_notice_days;
        $daysBetween = now()->diffInDays($startDate);
        
        if ($daysBetween < $advanceNoticeDays) {
            if ($daysRequested < 5) {
                if ($daysBetween < 15) {
                    $errors[] = "Préavis de 15 jours requis pour les congés de moins de 5 jours";
                }
            } else {
                if ($daysBetween < 30) {
                    $errors[] = "Préavis de 1 mois requis pour les congés de plus de 5 jours";
                }
            }
        }

        // Vérifier les restrictions saisonnières (été obligatoire)
        if ($this->leave_type === 'annual') {
            $summerStart = Carbon::create($startDate->year, 7, 1);
            $summerEnd = Carbon::create($startDate->year, 8, 31);
            
            if ($startDate->between($summerStart, $summerEnd) || $endDate->between($summerStart, $summerEnd)) {
                // Vérifier si l'employé a déjà pris ses 2 semaines d'été obligatoires
                $employee = Employee::find($employeeId);
                if ($employee) {
                    $summerDaysTaken = $employee->getSummerLeaveDays($startDate->year);
                    if ($summerDaysTaken < 14) {
                        $warnings[] = "Minimum 2 semaines de congés requis entre juillet et août";
                    }
                }
            }
        }

        // Vérifier les périodes interdites
        if ($this->blackout_periods) {
            foreach ($this->blackout_periods as $blackout) {
                $blackoutStart = Carbon::parse($blackout['start']);
                $blackoutEnd = Carbon::parse($blackout['end']);
                
                if ($startDate->between($blackoutStart, $blackoutEnd) || 
                    $endDate->between($blackoutStart, $blackoutEnd)) {
                    $errors[] = "Congés interdits pendant la période: {$blackout['reason']}";
                }
            }
        }

        // Vérifier le certificat médical
        if ($this->requires_medical_certificate && 
            $this->medical_certificate_after_days && 
            $daysRequested >= $this->medical_certificate_after_days) {
            $warnings[] = "Certificat médical requis pour {$daysRequested} jours";
        }

        return [
            'errors' => $errors,
            'warnings' => $warnings,
        ];
    }

    /**
     * Déterminer si l'approbation RH est requise
     */
    public static function requiresHrApproval(string $leaveType, int $daysRequested, Carbon $startDate, Carbon $endDate): bool
    {
        // Plus de 10 jours consécutifs = approbation RH
        if ($daysRequested > 10) {
            return true;
        }

        // Congés sans solde = toujours approbation RH
        if ($leaveType === 'unpaid') {
            return true;
        }

        // Congés maternité/paternité = approbation RH
        if (in_array($leaveType, ['maternity', 'paternity'])) {
            return true;
        }

        return false;
    }

    /**
     * Obtenir les règles par type de congé
     */
    public static function getRulesForLeaveType(string $leaveType): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('leave_type', $leaveType)
                   ->where('is_active', true)
                   ->get();
    }

    /**
     * Créer les règles par défaut selon les spécifications Namie
     */
    public static function createDefaultRules(): void
    {
        $defaultRules = [
            // Congés payés
            [
                'leave_type' => 'annual',
                'rule_name' => 'Congés payés standard',
                'description' => 'Règles pour les congés payés annuels',
                'max_consecutive_days' => 28, // 4 semaines
                'advance_notice_days' => 15, // Minimum 15 jours
                'requires_hr_approval' => false,
                'requires_manager_approval' => true,
                'seasonal_restrictions' => [
                    'summer_mandatory' => [
                        'start' => '07-01',
                        'end' => '08-31',
                        'min_days' => 14,
                        'description' => 'Minimum 2 semaines entre juillet et août'
                    ]
                ],
            ],
            // Congés maladie
            [
                'leave_type' => 'sick',
                'rule_name' => 'Congés maladie',
                'description' => 'Règles pour les arrêts maladie',
                'max_consecutive_days' => null,
                'advance_notice_days' => 0, // Déclaration a posteriori
                'requires_hr_approval' => false,
                'requires_manager_approval' => false,
                'requires_medical_certificate' => true,
                'medical_certificate_after_days' => 4, // À partir du 4ème jour
            ],
            // Congés sans solde
            [
                'leave_type' => 'unpaid',
                'rule_name' => 'Congés sans solde',
                'description' => 'Maximum 6 mois par période de 12 mois',
                'max_consecutive_days' => 180, // 6 mois
                'advance_notice_days' => 30,
                'requires_hr_approval' => true,
                'requires_manager_approval' => true,
                'max_per_year' => 180,
            ],
        ];

        foreach ($defaultRules as $rule) {
            self::firstOrCreate(
                [
                    'leave_type' => $rule['leave_type'],
                    'rule_name' => $rule['rule_name'],
                ],
                $rule
            );
        }
    }

    /**
     * Scope pour les règles actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope par type de congé
     */
    public function scopeForLeaveType($query, string $leaveType)
    {
        return $query->where('leave_type', $leaveType);
    }
}
