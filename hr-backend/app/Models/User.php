<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relations pour les permissions utilisateur
     */
    public function userPermissions(): HasMany
    {
        return $this->hasMany(UserPermission::class);
    }

    public function activePermissions(): HasMany
    {
        return $this->hasMany(UserPermission::class)->active();
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
                    ->withPivot(['granted', 'granted_by', 'reason', 'granted_at', 'expires_at'])
                    ->withTimestamps()
                    ->wherePivot('granted', true)
                    ->wherePivot(function ($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', now());
                    });
    }

    /**
     * Vérifier si l'utilisateur a une permission spécifique
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /**
     * Vérifier si l'utilisateur peut gérer les permissions
     */
    public function canManagePermissions(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'hr']);
    }

    /**
     * Accorder une permission à l'utilisateur
     */
    public function grantPermission(int $permissionId, int $grantedBy, string $reason = null, $expiresAt = null): UserPermission
    {
        return UserPermission::updateOrCreate(
            [
                'user_id' => $this->id,
                'permission_id' => $permissionId
            ],
            [
                'granted' => true,
                'granted_by' => $grantedBy,
                'reason' => $reason,
                'granted_at' => now(),
                'expires_at' => $expiresAt
            ]
        );
    }

    /**
     * Révoquer une permission de l'utilisateur
     */
    public function revokePermission(int $permissionId, int $revokedBy, string $reason = null): bool
    {
        $userPermission = UserPermission::where('user_id', $this->id)
                                       ->where('permission_id', $permissionId)
                                       ->first();

        if ($userPermission) {
            return $userPermission->revoke($revokedBy, $reason);
        }

        return false;
    }

    /**
     * Obtenir toutes les permissions avec leur statut
     */
    public function getAllPermissionsWithStatus(): array
    {
        $allPermissions = Permission::all();
        $userPermissions = $this->userPermissions()
                               ->with(['permission', 'grantedBy'])
                               ->get()
                               ->keyBy('permission_id');

        return $allPermissions->map(function ($permission) use ($userPermissions) {
            $userPermission = $userPermissions->get($permission->id);
            
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'display_name' => $permission->display_name,
                'description' => $permission->description,
                'resource' => $permission->resource,
                'action' => $permission->action,
                'granted' => $userPermission ? $userPermission->granted : false,
                'active' => $userPermission ? $userPermission->isActive() : false,
                'status' => $userPermission ? $userPermission->status : 'Non accordée',
                'status_color' => $userPermission ? $userPermission->status_color : 'gray',
                'granted_by' => $userPermission && $userPermission->grantedBy ? 
                               $userPermission->grantedBy->name : null,
                'granted_at' => $userPermission ? $userPermission->granted_at : null,
                'expires_at' => $userPermission ? $userPermission->expires_at : null,
                'reason' => $userPermission ? $userPermission->reason : null
            ];
        })->toArray();
    }

    /**
     * Les rôles de l'utilisateur
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user')
                    ->withPivot(['assigned_at', 'assigned_by'])
                    ->withTimestamps();
    }

    /**
     * Les notifications de l'utilisateur
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Les logs d'audit de l'utilisateur
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Vérifier si l'utilisateur a une permission spécifique
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()->get()->some(function ($role) use ($permission) {
            return $role->hasPermission($permission);
        });
    }

    /**
     * Assigner un rôle à l'utilisateur
     */
    public function assignRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();
        if ($role && !$this->hasRole($roleName)) {
            $this->roles()->attach($role->id, [
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
            ]);
        }
    }

    /**
     * Retirer un rôle de l'utilisateur
     */
    public function removeRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();
        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * Obtenir toutes les permissions de l'utilisateur
     */
    public function getAllPermissions(): array
    {
        return $this->roles()->get()->flatMap(function ($role) {
            return $role->permissions ?? [];
        })->unique()->values()->toArray();
    }

    /**
     * Obtenir les notifications non lues
     */
    public function unreadNotifications(): HasMany
    {
        return $this->notifications()->unread();
    }

    /**
     * Compter les notifications non lues
     */
    public function unreadNotificationsCount(): int
    {
        return $this->unreadNotifications()->count();
    }
}
