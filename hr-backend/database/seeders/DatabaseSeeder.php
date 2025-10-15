<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Phase 1 - Fondations
            PermissionSeeder::class,
            RoleSeeder::class,
            DepartmentSeeder::class,  // Créer les départements avant les employés
            EmployeeSeeder::class,
            
            // Phase 2 - Gestion complète des congés et absences
            LeaveRuleSeeder::class,
            LeavePeriodSeeder::class,
        ]);
    }
}
