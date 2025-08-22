<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Ahmed Benali',
                'email' => 'ahmed@example.com',
                'password' => 'client123',
            ],
            [
                'name' => 'Fatima El Amri',
                'email' => 'fatima@example.com',
                'password' => 'client123',
            ],
            [
                'name' => 'Youssef Tazi',
                'email' => 'youssef@example.com',
                'password' => 'client123',
            ],
            [
                'name' => 'Aicha Ouali',
                'email' => 'aicha@example.com',
                'password' => 'client123',
            ],
            [
                'name' => 'Omar Alami',
                'email' => 'omar@example.com',
                'password' => 'client123',
            ],
            [
                'name' => 'Khadija Bennani',
                'email' => 'khadija@example.com',
                'password' => 'client123',
            ],
        ];

        foreach ($clients as $clientData) {
            User::firstOrCreate(
                ['email' => $clientData['email']],
                [
                    'name' => $clientData['name'],
                    'password' => Hash::make($clientData['password']),
                    'role' => 'client',
                    'email_verified_at' => now(),
                ]
            );
        }

        echo "✅ Clients créés avec succès!\n";
        echo "📧 Emails: ahmed@example.com, fatima@example.com, youssef@example.com, etc.\n";
        echo "🔐 Mot de passe: client123\n";
    }
}
