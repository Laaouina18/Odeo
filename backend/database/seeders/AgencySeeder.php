<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Agency;
use Illuminate\Support\Facades\Hash;

class AgencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer quelques agences de test
        $agencies = [
            [
                'name' => 'Agence Atlas Adventures',
                'email' => 'agency1@odeo.com',
                'password' => 'agency123',
                'phone' => '0612345678',
                'description' => 'Spécialiste des aventures dans l\'Atlas marocain',
            ],
            [
                'name' => 'Agence Sahara Tours',
                'email' => 'agency2@odeo.com', 
                'password' => 'agency123',
                'phone' => '0687654321',
                'description' => 'Excursions dans le désert du Sahara',
            ],
            [
                'name' => 'Agence Coastal Trips',
                'email' => 'agency3@odeo.com',
                'password' => 'agency123', 
                'phone' => '0611223344',
                'description' => 'Tours côtiers et activités maritimes',
            ],
        ];

        foreach ($agencies as $agencyData) {
            // Créer l'utilisateur avec le rôle agency
            $user = User::firstOrCreate(
                ['email' => $agencyData['email']],
                [
                    'name' => $agencyData['name'],
                    'password' => Hash::make($agencyData['password']),
                    'role' => 'agency',
                    'email_verified_at' => now(),
                ]
            );

            // Créer l'agence correspondante
            $agency = Agency::firstOrCreate(
                ['email' => $agencyData['email']],
                [
                    'user_id' => $user->id,
                    'name' => $agencyData['name'],
                    'phone' => $agencyData['phone'],
                    'description' => $agencyData['description'],
                    'status' => 'active',
                ]
            );

            echo "✅ Agence créée: {$agencyData['name']} (User ID: {$user->id}, Agency ID: {$agency->id})\n";
        }

        echo "📧 Identifiants agences: agency1@odeo.com, agency2@odeo.com, agency3@odeo.com\n";
        echo "🔐 Mot de passe: agency123\n";
    }
}
