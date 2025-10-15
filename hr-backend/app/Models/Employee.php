<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_number',
        'first_name',
        'last_name',
        'birth_date',
        'birth_place',
        'email',
        'phone',
        'personal_phone',
        'postal_address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'department',
        'department_id',
        'position',
        'contract_type',
        'hire_date',
        'salary',
        'status',
        'avatar',
        'manager_id',
        'secondary_assignments',
        'data_history',
        'last_modified_at',
        'last_modified_by'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
        'secondary_assignments' => 'array',
        'data_history' => 'array',
        'last_modified_at' => 'datetime',
    ];

    // Relations
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }

    // Accesseurs
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAvatarInitialsAttribute()
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    /**
     * Relation avec l'utilisateur qui a modifié en dernier
     */
    public function lastModifiedBy()
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    /**
     * Relation avec le département
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Relation avec les employés managés (si cet employé est manager d'un département)
     */
    public function managedDepartments(): HasMany
    {
        return $this->hasMany(Department::class, 'manager_id');
    }

    /**
     * Générer un numéro matricule automatique
     */
    public static function generateEmployeeNumber(): string
    {
        $year = now()->year;
        $lastEmployee = self::where('employee_number', 'like', "NAM-{$year}-%")
                           ->orderBy('employee_number', 'desc')
                           ->first();
        
        if ($lastEmployee) {
            $lastNumber = (int) substr($lastEmployee->employee_number, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        
        return "NAM-{$year}-{$newNumber}";
    }

    /**
     * Enregistrer les modifications dans l'historique
     */
    public function recordChange(array $changes, User $user = null): void
    {
        $history = $this->data_history ?? [];
        $history[] = [
            'timestamp' => now()->toISOString(),
            'user_id' => $user?->id ?? auth()->id(),
            'user_name' => $user?->name ?? auth()->user()?->name,
            'changes' => $changes,
        ];
        
        // Garder seulement les 50 dernières modifications
        if (count($history) > 50) {
            $history = array_slice($history, -50);
        }
        
        $this->update([
            'data_history' => $history,
            'last_modified_at' => now(),
            'last_modified_by' => $user?->id ?? auth()->id(),
        ]);
    }

    /**
     * Vérifier si l'employé a des affectations secondaires actives
     */
    public function hasActiveSecondaryAssignments(): bool
    {
        $assignments = $this->secondary_assignments ?? [];
        $now = now();
        
        foreach ($assignments as $assignment) {
            $startDate = \Carbon\Carbon::parse($assignment['start_date']);
            $endDate = \Carbon\Carbon::parse($assignment['end_date']);
            
            if ($now->between($startDate, $endDate)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Obtenir les affectations secondaires actives
     */
    public function getActiveSecondaryAssignments(): array
    {
        $assignments = $this->secondary_assignments ?? [];
        $now = now();
        $active = [];
        
        foreach ($assignments as $assignment) {
            $startDate = \Carbon\Carbon::parse($assignment['start_date']);
            $endDate = \Carbon\Carbon::parse($assignment['end_date']);
            
            if ($now->between($startDate, $endDate)) {
                $active[] = $assignment;
            }
        }
        
        return $active;
    }

    /**
     * Relation avec les soldes de congés
     */
    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /**
     * Relation avec les absences
     */
    public function absences()
    {
        return $this->hasMany(Absence::class);
    }

    /**
     * Obtenir les jours de congés d'été pris pour une année
     */
    public function getSummerLeaveDays(int $year): int
    {
        $summerStart = Carbon::create($year, 7, 1);
        $summerEnd = Carbon::create($year, 8, 31);

        return Leave::where('employee_id', $this->id)
            ->where('type', 'annual')
            ->where('status', 'approved')
            ->where(function ($query) use ($summerStart, $summerEnd) {
                $query->whereBetween('start_date', [$summerStart, $summerEnd])
                      ->orWhereBetween('end_date', [$summerStart, $summerEnd])
                      ->orWhere(function ($q) use ($summerStart, $summerEnd) {
                          $q->where('start_date', '<=', $summerStart)
                            ->where('end_date', '>=', $summerEnd);
                      });
            })
            ->sum('working_days');
    }

    /**
     * Calculer l'ancienneté en années
     */
    public function getSeniorityYears(): int
    {
        if (!$this->hire_date) {
            return 0;
        }

        return Carbon::parse($this->hire_date)->diffInYears(now());
    }

    /**
     * Obtenir le solde de congés actuel pour un type donné
     */
    public function getLeaveBalance(string $leaveType, ?int $year = null): ?LeaveBalance
    {
        $year = $year ?? now()->year;
        
        return $this->leaveBalances()
            ->where('leave_type', $leaveType)
            ->where('year', $year)
            ->first();
    }

    /**
     * Boot method pour les événements du modèle
     */
    protected static function boot()
    {
        parent::boot();

        // Le numéro matricule est maintenant saisi manuellement
        // Plus de génération automatique lors de la création

        // Enregistrer les modifications dans l'audit trail
        static::updating(function ($employee) {
            $changes = $employee->getDirty();
            if (!empty($changes)) {
                AuditLog::log('updated', $employee, $employee->getOriginal(), $changes);
            }
        });

        static::created(function ($employee) {
            AuditLog::log('created', $employee, null, $employee->getAttributes());
        });

        static::deleted(function ($employee) {
            AuditLog::log('deleted', $employee, $employee->getAttributes(), null);
        });
    }
} 