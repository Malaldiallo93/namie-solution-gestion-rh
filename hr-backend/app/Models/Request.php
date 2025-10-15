<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_number',
        'employee_id',
        'type',
        'title',
        'description',
        'priority',
        'status',
        'amount',
        'currency',
        'requested_date',
        'end_date',
        'due_date',
        'manager_id',
        'manager_comments',
        'hr_id',
        'hr_comments',
        'finance_id',
        'finance_comments',
        'metadata',
        'attachments',
        'processed_by',
        'processing_notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'requested_date' => 'date',
        'end_date' => 'date',
        'due_date' => 'date',
        'manager_approved_at' => 'datetime',
        'hr_approved_at' => 'datetime',
        'finance_approved_at' => 'datetime',
        'processed_at' => 'datetime',
        'metadata' => 'array',
        'attachments' => 'array'
    ];

    /**
     * Boot method pour générer automatiquement le numéro de demande
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($request) {
            if (!$request->request_number) {
                $request->request_number = self::generateRequestNumber($request->type);
            }
        });
    }

    /**
     * Générer un numéro de demande unique
     */
    public static function generateRequestNumber(string $type): string
    {
        $prefix = match ($type) {
            'leave' => 'LEA',
            'expense' => 'EXP',
            'document' => 'DOC',
            'equipment' => 'EQP',
            'training' => 'TRA',
            'overtime' => 'OVT',
            'advance' => 'ADV',
            default => 'REQ'
        };

        $year = date('Y');
        $month = date('m');
        
        // Compter les demandes du même type ce mois-ci
        $count = self::where('type', $type)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('%s-%s%s-%04d', $prefix, $year, $month, $count);
    }

    /**
     * Relations
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function hr(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'hr_id');
    }

    public function finance(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'finance_id');
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'processed_by');
    }

    /**
     * Scopes
     */
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

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeRequiringApproval($query, int $managerId)
    {
        return $query->where('manager_id', $managerId)
            ->whereIn('status', ['pending', 'under_review']);
    }

    /**
     * Accesseurs
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'En attente',
            'under_review' => 'En cours d\'examen',
            'approved' => 'Approuvée',
            'rejected' => 'Rejetée',
            'cancelled' => 'Annulée',
            'completed' => 'Terminée',
            default => 'Inconnu'
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'leave' => 'Congé',
            'expense' => 'Note de frais',
            'document' => 'Document',
            'equipment' => 'Équipement',
            'training' => 'Formation',
            'overtime' => 'Heures supplémentaires',
            'advance' => 'Avance sur salaire',
            'other' => 'Autre',
            default => 'Inconnu'
        };
    }

    public function getPriorityLabelAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'Faible',
            'medium' => 'Moyenne',
            'high' => 'Élevée',
            'urgent' => 'Urgente',
            default => 'Moyenne'
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'under_review' => 'blue',
            'approved' => 'green',
            'rejected' => 'red',
            'cancelled' => 'gray',
            'completed' => 'green',
            default => 'gray'
        };
    }

    public function getPriorityColorAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'gray',
            'medium' => 'blue',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'blue'
        };
    }

    /**
     * Méthodes d'action
     */
    public function approve(int $approverId, string $comments = null): bool
    {
        $this->status = 'approved';
        $this->processed_by = $approverId;
        $this->processed_at = now();
        if ($comments) {
            $this->processing_notes = $comments;
        }
        return $this->save();
    }

    public function reject(int $approverId, string $reason): bool
    {
        $this->status = 'rejected';
        $this->processed_by = $approverId;
        $this->processed_at = now();
        $this->processing_notes = $reason;
        return $this->save();
    }

    public function cancel(int $employeeId, string $reason = null): bool
    {
        if ($this->employee_id !== $employeeId) {
            return false; // Seul le demandeur peut annuler
        }
        
        $this->status = 'cancelled';
        $this->processed_by = $employeeId;
        $this->processed_at = now();
        if ($reason) {
            $this->processing_notes = $reason;
        }
        return $this->save();
    }

    /**
     * Vérifier si la demande peut être modifiée
     */
    public function canBeModified(): bool
    {
        return in_array($this->status, ['pending', 'under_review']);
    }

    /**
     * Vérifier si la demande peut être annulée
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'under_review']);
    }

    /**
     * Obtenir les prochaines étapes d'approbation
     */
    public function getNextApprovalSteps(): array
    {
        $steps = [];
        
        if (!$this->manager_approved_at && $this->manager_id) {
            $steps[] = 'Manager approval required';
        }
        
        if ($this->manager_approved_at && !$this->hr_approved_at && $this->hr_id) {
            $steps[] = 'HR approval required';
        }
        
        if ($this->hr_approved_at && !$this->finance_approved_at && $this->finance_id) {
            $steps[] = 'Finance approval required';
        }
        
        return $steps;
    }
}