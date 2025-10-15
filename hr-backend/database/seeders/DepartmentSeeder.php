<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Ressources Humaines',
                'code' => 'RH',
                'description' => 'Gestion du personnel, recrutement, formation et développement des compétences.',
                'location' => 'Bâtiment A - 2ème étage',
                'budget' => 150000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Recrutement', 'Formation', 'Paie', 'Relations sociales'],
                    'effectif_cible' => 8
                ]
            ],
            [
                'name' => 'Informatique',
                'code' => 'IT',
                'description' => 'Développement, maintenance et support des systèmes informatiques.',
                'location' => 'Bâtiment B - 1er étage',
                'budget' => 300000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Développement', 'Infrastructure', 'Support utilisateur'],
                    'effectif_cible' => 12
                ]
            ],
            [
                'name' => 'Commercial',
                'code' => 'COM',
                'description' => 'Ventes, prospection et relation client.',
                'location' => 'Bâtiment A - 1er étage',
                'budget' => 200000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Ventes', 'Prospection', 'SAV', 'Marketing'],
                    'effectif_cible' => 15
                ]
            ],
            [
                'name' => 'Comptabilité',
                'code' => 'COMPTA',
                'description' => 'Gestion financière, comptabilité et contrôle de gestion.',
                'location' => 'Bâtiment A - 3ème étage',
                'budget' => 120000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Comptabilité générale', 'Contrôle de gestion', 'Fiscalité'],
                    'effectif_cible' => 6
                ]
            ],
            [
                'name' => 'Production',
                'code' => 'PROD',
                'description' => 'Fabrication, qualité et logistique.',
                'location' => 'Atelier - Rez-de-chaussée',
                'budget' => 500000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Fabrication', 'Contrôle qualité', 'Maintenance', 'Logistique'],
                    'effectif_cible' => 25
                ]
            ],
            [
                'name' => 'Direction',
                'code' => 'DIR',
                'description' => 'Direction générale et stratégie d\'entreprise.',
                'location' => 'Bâtiment A - 4ème étage',
                'budget' => 80000.00,
                'is_active' => true,
                'metadata' => [
                    'responsabilites' => ['Stratégie', 'Gouvernance', 'Relations externes'],
                    'effectif_cible' => 3
                ]
            ]
        ];

        foreach ($departments as $departmentData) {
            Department::create($departmentData);
        }

        $this->command->info('✅ ' . count($departments) . ' départements créés avec succès');
    }
}