<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur admin
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@odeo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Créer un deuxième admin de test
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@odeo.com',
            'password' => Hash::make('superadmin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        echo "✅ Utilisateurs admin créés avec succès!\n";
        echo "📧 Email: admin@odeo.com | 🔐 Mot de passe: admin123\n";
        echo "📧 Email: superadmin@odeo.com | 🔐 Mot de passe: superadmin123\n";
    }
}
