<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'absence_type',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'duration_hours',
        'declared_at',
        'declared_on_time',
        'justification_provided',
        'medical_certificate_required',
        'medical_certificate_provided',
        'justification_file_path',
        'reason',
        'manager_notes',
        'salary_deduction',
        'disciplinary_action',
        'status',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'duration_hours' => 'decimal:2',
        'declared_at' => 'datetime',
        'validated_at' => 'datetime',
        'declared_on_time' => 'boolean',
        'justification_provided' => 'boolean',
        'medical_certificate_required' => 'boolean',
        'medical_certificate_provided' => 'boolean',
        'disciplinary_action' => 'boolean',
        'salary_deduction' => 'decimal:2',
    ];

    /**
     * Relation avec l'employé
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Relation avec l'utilisateur qui a validé
     */
    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**
     * Déclarer une absence selon les règles Namie
     */
    public static function declareAbsence(array $data): self
    {
        $now = now();
        $startDate = Carbon::parse($data['start_date']);
        $declaredOnTime = false;

        // Vérifier si déclaré dans les temps (avant 9h le jour même ou dans les 48h)
        if ($startDate->isToday()) {
            $declaredOnTime = $now->hour < 9;
        } elseif ($startDate->isPast()) {
            $declaredOnTime = $now->diffInHours($startDate) <= 48;
        } else {
            $declaredOnTime = true; // Déclaration anticipée
        }

        // Déterminer si certificat médical requis
        $medicalCertRequired = false;
        if (isset($data['is_sick']) && $data['is_sick']) {
            $durationDays = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date'])) + 1;
            $medicalCertRequired = $durationDays >= 4; // À partir du 4ème jour
        }

        return self::create(array_merge($data, [
            'declared_at' => $now,
            'declared_on_time' => $declaredOnTime,
            'medical_certificate_required' => $medicalCertRequired,
            'absence_type' => $declaredOnTime ? 'justified' : 'unjustified',
        ]));
    }

    /**
     * Calculer la retenue sur salaire
     */
    public function calculateSalaryDeduction(): float
    {
        if ($this->absence_type === 'authorized') {
            return 0; // Pas de retenue pour les absences autorisées
        }

        $employee = $this->employee;
        if (!$employee) {
            return 0;
        }

        // Calcul au prorata temporel exact
        $dailySalary = $employee->salary / 30; // Salaire journalier approximatif
        $deduction = $dailySalary * $this->duration_hours / 8; // Retenue proportionnelle

        return round($deduction, 2);
    }

    /**
     * Valider une absence
     */
    public function validate(User $validator, string $decision, ?string $notes = null): bool
    {
        if (!in_array($decision, ['validated', 'rejected'])) {
            return false;
        }

        $this->update([
            'status' => $decision,
            'validated_by' => $validator->id,
            'validated_at' => now(),
            'manager_notes' => $notes,
        ]);

        // Calculer la retenue salariale si absence injustifiée
        if ($decision === 'validated' && $this->absence_type === 'unjustified') {
            $this->update([
                'salary_deduction' => $this->calculateSalaryDeduction(),
            ]);
        }

        // Déclencher action disciplinaire si récurrence
        $this->checkRecurrence();

        return true;
    }

    /**
     * Vérifier la récurrence d'absences injustifiées
     */
    private function checkRecurrence(): void
    {
        $recentUnjustified = self::where('employee_id', $this->employee_id)
            ->where('absence_type', 'unjustified')
            ->where('status', 'validated')
            ->where('created_at', '>=', now()->subMonths(3))
            ->count();

        if ($recentUnjustified >= 3) {
            $this->update(['disciplinary_action' => true]);
            
            // Créer une notification pour RH
            Notification::create([
                'user_id' => User::whereHas('roles', function($q) {
                    $q->where('name', 'hr_manager');
                })->first()?->id,
                'type' => 'disciplinary_action',
                'title' => 'Action disciplinaire requise',
                'message' => "L'employé {$this->employee->full_name} a 3+ absences injustifiées en 3 mois",
                'priority' => 'high',
                'data' => [
                    'employee_id' => $this->employee_id,
                    'absence_id' => $this->id,
                    'unjustified_count' => $recentUnjustified,
                ],
            ]);
        }
    }

    /**
     * Uploader un justificatif
     */
    public function uploadJustification(string $filePath): void
    {
        $this->update([
            'justification_file_path' => $filePath,
            'justification_provided' => true,
        ]);

        // Si c'était injustifié et qu'un justificatif est fourni, repasser en justifié
        if ($this->absence_type === 'unjustified') {
            $this->update(['absence_type' => 'justified']);
        }
    }

    /**
     * Marquer le certificat médical comme fourni
     */
    public function provideMedicalCertificate(string $filePath): void
    {
        $this->update([
            'justification_file_path' => $filePath,
            'medical_certificate_provided' => true,
            'justification_provided' => true,
        ]);
    }

    /**
     * Obtenir les absences nécessitant une attention
     */
    public static function getRequiringAttention(): \Illuminate\Database\Eloquent\Collection
    {
        return self::where(function ($query) {
            $query->where('absence_type', 'unjustified')
                  ->orWhere(function ($q) {
                      $q->where('medical_certificate_required', true)
                        ->where('medical_certificate_provided', false);
                  });
        })
        ->where('status', 'pending_review')
        ->with('employee')
        ->get();
    }

    /**
     * Scope pour les absences injustifiées
     */
    public function scopeUnjustified($query)
    {
        return $query->where('absence_type', 'unjustified');
    }

    /**
     * Scope pour les absences en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending_review');
    }

    /**
     * Scope pour les absences récentes
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope pour un employé spécifique
     */
    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Accesseur pour la durée en jours
     */
    public function getDurationInDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /**
     * Accesseur pour savoir si l'absence nécessite une action
     */
    public function getRequiresActionAttribute(): bool
    {
        return $this->absence_type === 'unjustified' ||
               ($this->medical_certificate_required && !$this->medical_certificate_provided) ||
               $this->disciplinary_action;
    }

    /**
     * Boot method pour les événements du modèle
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($absence) {
            AuditLog::log('created', $absence, null, $absence->getAttributes());
        });

        static::updated(function ($absence) {
            $changes = $absence->getDirty();
            if (!empty($changes)) {
                AuditLog::log('updated', $absence, $absence->getOriginal(), $changes);
            }
        });
    }
}
