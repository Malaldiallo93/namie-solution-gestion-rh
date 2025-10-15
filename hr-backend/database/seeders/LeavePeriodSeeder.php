<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LeavePeriod;

class LeavePeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Initialiser les périodes par défaut
        LeavePeriod::initializeDefaultPeriods();

        // Ajouter des fermetures d'entreprise pour l'exemple
        $currentYear = now()->year;
        $period = LeavePeriod::where('year', $currentYear)->first();
        
        if ($period) {
            $period->update([
                'company_closures' => [
                    [
                        'start' => $currentYear . '-12-25',
                        'end' => $currentYear . '-12-31',
                        'reason' => 'Fermeture de fin d\'année',
                        'description' => 'Fermeture annuelle de l\'entreprise'
                    ],
                    [
                        'start' => ($currentYear + 1) . '-01-01',
                        'end' => ($currentYear + 1) . '-01-02',
                        'reason' => 'Fermeture de début d\'année',
                        'description' => 'Pont du Nouvel An'
                    ],
                ]
            ]);
        }

        $this->command->info('Périodes de référence créées avec succès.');
    }
}
