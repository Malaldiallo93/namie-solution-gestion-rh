<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'resource',
        'action',
    ];

    /**
     * Générer le nom de permission à partir de la ressource et de l'action
     */
    public static function generateName(string $resource, string $action): string
    {
        return "{$resource}.{$action}";
    }

    /**
     * Scope pour filtrer par ressource
     */
    public function scopeForResource($query, string $resource)
    {
        return $query->where('resource', $resource);
    }

    /**
     * Scope pour filtrer par action
     */
    public function scopeForAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Obtenir toutes les permissions groupées par ressource
     */
    public static function getGroupedPermissions(): array
    {
        return self::all()->groupBy('resource')->map(function ($permissions) {
            return $permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'display_name' => $permission->display_name,
                    'action' => $permission->action,
                ];
            });
        })->toArray();
    }
}
