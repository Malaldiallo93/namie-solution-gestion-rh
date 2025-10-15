<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'manager_id',
        'location',
        'budget',
        'is_active',
        'metadata',
        'department_type',
        'target_headcount',
        'objectives',
        'key_skills'
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'array'
    ];

    /**
     * Relation avec les employés du département
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Relation avec le manager du département
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * Scope pour les départements actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Générer automatiquement un code de département
     */
    public static function generateCode(string $name): string
    {
        // Prendre les 3 premières lettres du nom en majuscules
        $baseCode = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $name), 0, 3));
        
        // Vérifier l'unicité et ajouter un numéro si nécessaire
        $code = $baseCode;
        $counter = 1;
        
        while (self::where('code', $code)->exists()) {
            $code = $baseCode . str_pad($counter, 2, '0', STR_PAD_LEFT);
            $counter++;
        }
        
        return $code;
    }

    /**
     * Obtenir le nombre d'employés dans le département
     */
    public function getEmployeeCountAttribute(): int
    {
        return $this->employees()->count();
    }

    /**
     * Obtenir le budget formaté
     */
    public function getFormattedBudgetAttribute(): string
    {
        return $this->budget ? number_format($this->budget, 2, ',', ' ') . ' €' : 'Non défini';
    }

    /**
     * Vérifier si le département peut être supprimé
     */
    public function canBeDeleted(): bool
    {
        return $this->employees()->count() === 0;
    }
}