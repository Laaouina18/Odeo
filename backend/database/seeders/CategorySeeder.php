<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Quad',
            'Vélo', 
            'Voyage',
            'Bateau',
            'Voiture',
            'Moto',
            'Trip',
            'Randonnée',
            'Sports aquatiques',
            'Culture',
        ];

        foreach ($categories as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName]);
        }

        echo "✅ Catégories créées avec succès!\n";
    }
}
