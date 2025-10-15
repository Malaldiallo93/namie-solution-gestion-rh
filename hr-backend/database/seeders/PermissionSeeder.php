<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Gestion des employés
            [
                'name' => 'employees.create',
                'display_name' => 'Créer des employés',
                'description' => 'Peut créer de nouveaux employés',
                'resource' => 'employees',
                'action' => 'create'
            ],
            [
                'name' => 'employees.read',
                'display_name' => 'Voir les employés',
                'description' => 'Peut consulter les informations des employés',
                'resource' => 'employees',
                'action' => 'read'
            ],
            [
                'name' => 'employees.update',
                'display_name' => 'Modifier les employés',
                'description' => 'Peut modifier les informations des employés',
                'resource' => 'employees',
                'action' => 'update'
            ],
            [
                'name' => 'employees.delete',
                'display_name' => 'Supprimer des employés',
                'description' => 'Peut supprimer des employés',
                'resource' => 'employees',
                'action' => 'delete'
            ],
            [
                'name' => 'employees.read_sensitive',
                'display_name' => 'Voir données sensibles employés',
                'description' => 'Peut consulter les données sensibles (salaire, etc.)',
                'resource' => 'employees',
                'action' => 'read_sensitive'
            ],

            // Gestion des congés
            [
                'name' => 'leaves.create',
                'display_name' => 'Demander des congés',
                'description' => 'Peut créer des demandes de congés',
                'resource' => 'leaves',
                'action' => 'create'
            ],
            [
                'name' => 'leaves.read',
                'display_name' => 'Voir les congés',
                'description' => 'Peut consulter les demandes de congés',
                'resource' => 'leaves',
                'action' => 'read'
            ],
            [
                'name' => 'leaves.update',
                'display_name' => 'Modifier les congés',
                'description' => 'Peut modifier les demandes de congés',
                'resource' => 'leaves',
                'action' => 'update'
            ],
            [
                'name' => 'leaves.delete',
                'display_name' => 'Supprimer des congés',
                'description' => 'Peut supprimer des demandes de congés',
                'resource' => 'leaves',
                'action' => 'delete'
            ],
            [
                'name' => 'leaves.approve',
                'display_name' => 'Approuver des congés',
                'description' => 'Peut approuver ou rejeter des demandes de congés',
                'resource' => 'leaves',
                'action' => 'approve'
            ],

            // Gestion des feuilles de temps
            [
                'name' => 'timesheets.create',
                'display_name' => 'Créer des feuilles de temps',
                'description' => 'Peut créer des feuilles de temps',
                'resource' => 'timesheets',
                'action' => 'create'
            ],
            [
                'name' => 'timesheets.read',
                'display_name' => 'Voir les feuilles de temps',
                'description' => 'Peut consulter les feuilles de temps',
                'resource' => 'timesheets',
                'action' => 'read'
            ],
            [
                'name' => 'timesheets.update',
                'display_name' => 'Modifier les feuilles de temps',
                'description' => 'Peut modifier les feuilles de temps',
                'resource' => 'timesheets',
                'action' => 'update'
            ],
            [
                'name' => 'timesheets.delete',
                'display_name' => 'Supprimer des feuilles de temps',
                'description' => 'Peut supprimer des feuilles de temps',
                'resource' => 'timesheets',
                'action' => 'delete'
            ],

            // Administration système
            [
                'name' => 'admin.users',
                'display_name' => 'Gérer les utilisateurs',
                'description' => 'Peut gérer les comptes utilisateurs',
                'resource' => 'admin',
                'action' => 'users'
            ],
            [
                'name' => 'admin.roles',
                'display_name' => 'Gérer les rôles',
                'description' => 'Peut gérer les rôles et permissions',
                'resource' => 'admin',
                'action' => 'roles'
            ],
            [
                'name' => 'admin.audit',
                'display_name' => 'Voir les logs d\'audit',
                'description' => 'Peut consulter les logs d\'audit',
                'resource' => 'admin',
                'action' => 'audit'
            ],
            [
                'name' => 'admin.settings',
                'display_name' => 'Gérer les paramètres',
                'description' => 'Peut modifier les paramètres système',
                'resource' => 'admin',
                'action' => 'settings'
            ],

            // Rapports et analyses
            [
                'name' => 'reports.hr',
                'display_name' => 'Rapports RH',
                'description' => 'Peut générer et consulter les rapports RH',
                'resource' => 'reports',
                'action' => 'hr'
            ],
            [
                'name' => 'reports.payroll',
                'display_name' => 'Rapports paie',
                'description' => 'Peut générer et consulter les rapports de paie',
                'resource' => 'reports',
                'action' => 'payroll'
            ],

            // Gestion des demandes (nouveau système unifié)
            [
                'name' => 'requests.create',
                'display_name' => 'Créer des demandes',
                'description' => 'Peut soumettre des demandes (congés, frais, etc.)',
                'resource' => 'requests',
                'action' => 'create'
            ],
            [
                'name' => 'requests.read',
                'display_name' => 'Voir les demandes',
                'description' => 'Peut consulter les demandes soumises',
                'resource' => 'requests',
                'action' => 'read'
            ],
            [
                'name' => 'requests.update',
                'display_name' => 'Modifier des demandes',
                'description' => 'Peut modifier ses propres demandes',
                'resource' => 'requests',
                'action' => 'update'
            ],
            [
                'name' => 'requests.approve',
                'display_name' => 'Approuver des demandes',
                'description' => 'Peut approuver ou rejeter des demandes',
                'resource' => 'requests',
                'action' => 'approve'
            ],
            [
                'name' => 'requests.manage',
                'display_name' => 'Gérer toutes les demandes',
                'description' => 'Peut gérer toutes les demandes de l\'organisation',
                'resource' => 'requests',
                'action' => 'manage'
            ],

            // Gestion des départements
            [
                'name' => 'departments.create',
                'display_name' => 'Créer des départements',
                'description' => 'Peut créer de nouveaux départements',
                'resource' => 'departments',
                'action' => 'create'
            ],
            [
                'name' => 'departments.read',
                'display_name' => 'Voir les départements',
                'description' => 'Peut consulter les informations des départements',
                'resource' => 'departments',
                'action' => 'read'
            ],
            [
                'name' => 'departments.update',
                'display_name' => 'Modifier des départements',
                'description' => 'Peut modifier les informations des départements',
                'resource' => 'departments',
                'action' => 'update'
            ],
            [
                'name' => 'departments.delete',
                'display_name' => 'Supprimer des départements',
                'description' => 'Peut supprimer des départements',
                'resource' => 'departments',
                'action' => 'delete'
            ],

            // Gestion des permissions (nouveau système)
            [
                'name' => 'permissions.view',
                'display_name' => 'Voir les permissions',
                'description' => 'Peut consulter les permissions système',
                'resource' => 'permissions',
                'action' => 'view'
            ],
            [
                'name' => 'permissions.manage',
                'display_name' => 'Gérer les permissions',
                'description' => 'Peut attribuer et révoquer des permissions utilisateur',
                'resource' => 'permissions',
                'action' => 'manage'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
