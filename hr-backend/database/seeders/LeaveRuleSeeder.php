<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LeaveRule;

class LeaveRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Utiliser la méthode du modèle pour créer les règles par défaut
        LeaveRule::createDefaultRules();

        // Ajouter des règles spécifiques supplémentaires
        $additionalRules = [
            // RTT
            [
                'leave_type' => 'rtt',
                'rule_name' => 'RTT standard',
                'description' => 'Règles pour les jours RTT',
                'max_consecutive_days' => 5,
                'advance_notice_days' => 7,
                'requires_hr_approval' => false,
                'requires_manager_approval' => true,
                'max_per_year' => 12, // Variable selon l'ancienneté
            ],
            // Congés maternité
            [
                'leave_type' => 'maternity',
                'rule_name' => 'Congés maternité',
                'description' => 'Congés maternité légaux',
                'max_consecutive_days' => 112, // 16 semaines
                'advance_notice_days' => 30,
                'requires_hr_approval' => true,
                'requires_manager_approval' => true,
                'requires_medical_certificate' => true,
                'medical_certificate_after_days' => 1,
            ],
            // Congés paternité
            [
                'leave_type' => 'paternity',
                'rule_name' => 'Congés paternité',
                'description' => 'Congés paternité légaux',
                'max_consecutive_days' => 25, // 25 jours depuis 2021
                'advance_notice_days' => 30,
                'requires_hr_approval' => true,
                'requires_manager_approval' => true,
                'requires_medical_certificate' => true,
                'medical_certificate_after_days' => 1,
            ],
            // Congés exceptionnels
            [
                'leave_type' => 'exceptional',
                'rule_name' => 'Congés exceptionnels',
                'description' => 'Congés pour événements familiaux',
                'max_consecutive_days' => 10,
                'advance_notice_days' => 15,
                'requires_hr_approval' => false,
                'requires_manager_approval' => true,
                'max_per_year' => 10,
            ],
        ];

        foreach ($additionalRules as $rule) {
            LeaveRule::firstOrCreate(
                [
                    'leave_type' => $rule['leave_type'],
                    'rule_name' => $rule['rule_name'],
                ],
                $rule
            );
        }

        $this->command->info('Règles de congés créées avec succès.');
    }
}
