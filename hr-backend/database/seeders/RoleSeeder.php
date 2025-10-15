<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrateur',
                'description' => 'Accès complet à toutes les fonctionnalités du système',
                'is_system_role' => true,
                'permissions' => [
                    'employees.create', 'employees.read', 'employees.update', 'employees.delete', 'employees.read_sensitive',
                    'leaves.create', 'leaves.read', 'leaves.update', 'leaves.delete', 'leaves.approve',
                    'timesheets.create', 'timesheets.read', 'timesheets.update', 'timesheets.delete',
                    'admin.users', 'admin.roles', 'admin.audit', 'admin.settings',
                    'reports.hr', 'reports.payroll'
                ]
            ],
            [
                'name' => 'hr_manager',
                'display_name' => 'Responsable RH',
                'description' => 'Gestion complète des ressources humaines',
                'is_system_role' => true,
                'permissions' => [
                    'employees.create', 'employees.read', 'employees.update', 'employees.delete', 'employees.read_sensitive',
                    'leaves.create', 'leaves.read', 'leaves.update', 'leaves.delete', 'leaves.approve',
                    'timesheets.create', 'timesheets.read', 'timesheets.update', 'timesheets.delete',
                    'reports.hr', 'reports.payroll'
                ]
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manager',
                'description' => 'Gestion de son équipe et approbation des demandes',
                'is_system_role' => true,
                'permissions' => [
                    'employees.read', 'employees.update',
                    'leaves.create', 'leaves.read', 'leaves.update', 'leaves.approve',
                    'timesheets.create', 'timesheets.read', 'timesheets.update',
                    'reports.hr'
                ]
            ],
            [
                'name' => 'employee',
                'display_name' => 'Employé',
                'description' => 'Accès de base pour les employés',
                'is_system_role' => true,
                'permissions' => [
                    'employees.read',
                    'leaves.create', 'leaves.read', 'leaves.update',
                    'timesheets.create', 'timesheets.read', 'timesheets.update'
                ]
            ],
            [
                'name' => 'hr_assistant',
                'display_name' => 'Assistant RH',
                'description' => 'Support administratif RH',
                'is_system_role' => true,
                'permissions' => [
                    'employees.create', 'employees.read', 'employees.update',
                    'leaves.create', 'leaves.read', 'leaves.update',
                    'timesheets.create', 'timesheets.read', 'timesheets.update',
                    'reports.hr'
                ]
            ]
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
