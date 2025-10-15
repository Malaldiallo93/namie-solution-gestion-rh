<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'permission_id',
        'granted',
        'granted_by',
        'reason',
        'granted_at',
        'expires_at'
    ];

    protected $casts = [
        'granted' => 'boolean',
        'granted_at' => 'datetime',
        'expires_at' => 'datetime'
    ];

    /**
     * Boot method pour définir les événements
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($userPermission) {
            if (!$userPermission->granted_at) {
                $userPermission->granted_at = now();
            }
        });
    }

    /**
     * Relations
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    public function grantedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    /**
     * Scopes
     */
    public function scopeGranted($query)
    {
        return $query->where('granted', true);
    }

    public function scopeRevoked($query)
    {
        return $query->where('granted', false);
    }

    public function scopeActive($query)
    {
        return $query->where('granted', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForPermission($query, int $permissionId)
    {
        return $query->where('permission_id', $permissionId);
    }

    /**
     * Vérifier si la permission est active
     */
    public function isActive(): bool
    {
        if (!$this->granted) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Vérifier si la permission a expiré
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Révoquer la permission
     */
    public function revoke(int $revokedBy, string $reason = null): bool
    {
        $this->granted = false;
        $this->granted_by = $revokedBy;
        $this->reason = $reason;
        $this->granted_at = now();

        return $this->save();
    }

    /**
     * Accorder la permission
     */
    public function grant(int $grantedBy, string $reason = null, Carbon $expiresAt = null): bool
    {
        $this->granted = true;
        $this->granted_by = $grantedBy;
        $this->reason = $reason;
        $this->granted_at = now();
        $this->expires_at = $expiresAt;

        return $this->save();
    }

    /**
     * Obtenir le statut lisible
     */
    public function getStatusAttribute(): string
    {
        if (!$this->granted) {
            return 'Révoquée';
        }

        if ($this->isExpired()) {
            return 'Expirée';
        }

        if ($this->expires_at) {
            return 'Active (expire le ' . $this->expires_at->format('d/m/Y') . ')';
        }

        return 'Active';
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatusColorAttribute(): string
    {
        if (!$this->granted) {
            return 'red';
        }

        if ($this->isExpired()) {
            return 'orange';
        }

        return 'green';
    }
}