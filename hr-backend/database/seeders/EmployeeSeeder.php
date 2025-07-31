<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'first_name' => 'Marie',
                'last_name' => 'Dupont',
                'email' => 'marie.dupont@company.com',
                'phone' => '+33 1 23 45 67 89',
                'department' => 'IT',
                'position' => 'Développeuse Senior',
                'hire_date' => '2020-03-15',
                'salary' => 65000.00,
                'status' => 'active',
                'avatar' => 'MD'
            ],
            [
                'first_name' => 'Jean',
                'last_name' => 'Martin',
                'email' => 'jean.martin@company.com',
                'phone' => '+33 1 23 45 67 90',
                'department' => 'Marketing',
                'position' => 'Chef de Projet Marketing',
                'hire_date' => '2019-06-10',
                'salary' => 58000.00,
                'status' => 'active',
                'avatar' => 'JM'
            ],
            [
                'first_name' => 'Sophie',
                'last_name' => 'Bernard',
                'email' => 'sophie.bernard@company.com',
                'phone' => '+33 1 23 45 67 91',
                'department' => 'Ventes',
                'position' => 'Commerciale',
                'hire_date' => '2021-01-20',
                'salary' => 52000.00,
                'status' => 'active',
                'avatar' => 'SB'
            ],
            [
                'first_name' => 'Pierre',
                'last_name' => 'Durand',
                'email' => 'pierre.durand@company.com',
                'phone' => '+33 1 23 45 67 92',
                'department' => 'Finance',
                'position' => 'Contrôleur de Gestion',
                'hire_date' => '2018-09-05',
                'salary' => 62000.00,
                'status' => 'active',
                'avatar' => 'PD'
            ],
            [
                'first_name' => 'Emma',
                'last_name' => 'Leroy',
                'email' => 'emma.leroy@company.com',
                'phone' => '+33 1 23 45 67 93',
                'department' => 'RH',
                'position' => 'Responsable RH',
                'hire_date' => '2020-11-12',
                'salary' => 60000.00,
                'status' => 'active',
                'avatar' => 'EL'
            ],
            [
                'first_name' => 'Lucas',
                'last_name' => 'Moreau',
                'email' => 'lucas.moreau@company.com',
                'phone' => '+33 1 23 45 67 94',
                'department' => 'IT',
                'position' => 'Développeur Full-Stack',
                'hire_date' => '2022-02-28',
                'salary' => 55000.00,
                'status' => 'active',
                'avatar' => 'LM'
            ],
            [
                'first_name' => 'Camille',
                'last_name' => 'Petit',
                'email' => 'camille.petit@company.com',
                'phone' => '+33 1 23 45 67 95',
                'department' => 'Marketing',
                'position' => 'Chargée de Communication',
                'hire_date' => '2021-08-15',
                'salary' => 48000.00,
                'status' => 'active',
                'avatar' => 'CP'
            ],
            [
                'first_name' => 'Thomas',
                'last_name' => 'Roux',
                'email' => 'thomas.roux@company.com',
                'phone' => '+33 1 23 45 67 96',
                'department' => 'Ventes',
                'position' => 'Directeur Commercial',
                'hire_date' => '2017-04-22',
                'salary' => 75000.00,
                'status' => 'active',
                'avatar' => 'TR'
            ]
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }

        // Définir les managers
        $itManager = Employee::where('department', 'IT')->where('position', 'Développeuse Senior')->first();
        $marketingManager = Employee::where('department', 'Marketing')->where('position', 'Chef de Projet Marketing')->first();
        $salesManager = Employee::where('department', 'Ventes')->where('position', 'Directeur Commercial')->first();

        if ($itManager) {
            Employee::where('department', 'IT')->where('id', '!=', $itManager->id)->update(['manager_id' => $itManager->id]);
        }

        if ($marketingManager) {
            Employee::where('department', 'Marketing')->where('id', '!=', $marketingManager->id)->update(['manager_id' => $marketingManager->id]);
        }

        if ($salesManager) {
            Employee::where('department', 'Ventes')->where('id', '!=', $salesManager->id)->update(['manager_id' => $salesManager->id]);
        }
    }
}
