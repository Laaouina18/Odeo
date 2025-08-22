<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Agency;
use App\Models\Category;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agencies = Agency::all();
        $categories = Category::all();

        if ($agencies->isEmpty() || $categories->isEmpty()) {
            echo "❌ Veuillez d'abord créer des agences et des catégories\n";
            return;
        }

        $services = [
            [
                'title' => 'Excursion en Quad dans l\'Atlas',
                'description' => 'Découvrez les paysages magnifiques de l\'Atlas marocain en quad. Une aventure inoubliable à travers les montagnes.',
                'price' => 250.00,
                'location' => 'Marrakech',
                'duration' => 240,
                'max_participants' => 8,
                'status' => 'active',
                'dates' => ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-30'],
            ],
            [
                'title' => 'Circuit à Vélo dans la Palmeraie',
                'description' => 'Balade à vélo relaxante dans la palmeraie de Marrakech. Idéal pour les familles.',
                'price' => 80.00,
                'location' => 'Marrakech',
                'duration' => 120,
                'max_participants' => 12,
                'status' => 'active',
                'dates' => ['2025-08-24', '2025-08-25', '2025-08-28'],
            ],
            [
                'title' => 'Excursion dans le Désert du Sahara',
                'description' => 'Voyage de 3 jours dans le désert du Sahara avec nuitée sous les étoiles.',
                'price' => 450.00,
                'location' => 'Merzouga',
                'duration' => 4320, // 3 jours
                'max_participants' => 15,
                'status' => 'active',
                'dates' => ['2025-08-28', '2025-09-02', '2025-09-05'],
            ],
            [
                'title' => 'Sortie en Bateau à Essaouira',
                'description' => 'Croisière le long de la côte atlantique avec possibilité d\'observer les dauphins.',
                'price' => 120.00,
                'location' => 'Essaouira',
                'duration' => 180,
                'max_participants' => 20,
                'status' => 'active',
                'dates' => ['2025-08-26', '2025-08-29', '2025-09-01'],
            ],
            [
                'title' => 'Location de Voiture 4x4',
                'description' => 'Location de véhicules 4x4 pour explorer le Maroc en toute liberté.',
                'price' => 180.00,
                'location' => 'Marrakech',
                'duration' => 1440, // 1 jour
                'max_participants' => 4,
                'status' => 'active',
                'dates' => ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28'],
            ],
            [
                'title' => 'Randonnée dans les Gorges du Todra',
                'description' => 'Trekking guidé dans les spectaculaires gorges du Todra.',
                'price' => 200.00,
                'location' => 'Tinghir',
                'duration' => 360,
                'max_participants' => 10,
                'status' => 'active',
                'dates' => ['2025-08-30', '2025-09-03', '2025-09-06'],
            ],
            [
                'title' => 'Cours de Surf à Taghazout',
                'description' => 'Initiation au surf sur les meilleures vagues du Maroc.',
                'price' => 95.00,
                'location' => 'Taghazout',
                'duration' => 150,
                'max_participants' => 6,
                'status' => 'active',
                'dates' => ['2025-08-27', '2025-08-28', '2025-08-31'],
            ],
            [
                'title' => 'Visite des Monuments de Fès',
                'description' => 'Tour culturel guidé des monuments historiques de Fès.',
                'price' => 75.00,
                'location' => 'Fès',
                'duration' => 180,
                'max_participants' => 15,
                'status' => 'active',
                'dates' => ['2025-08-26', '2025-08-29', '2025-09-01'],
            ],
        ];

        foreach ($services as $serviceData) {
            // Assigner aléatoirement une agence et une catégorie
            $agency = $agencies->random();
            $category = $categories->random();

            Service::create([
                'agency_id' => $agency->id,
                'category_id' => $category->id,
                'title' => $serviceData['title'],
                'description' => $serviceData['description'],
                'price' => $serviceData['price'],
                'location' => $serviceData['location'],
                'duration' => $serviceData['duration'],
                'max_participants' => $serviceData['max_participants'],
                'status' => $serviceData['status'],
                'dates' => $serviceData['dates'],
            ]);
        }

        echo "✅ " . count($services) . " services créés avec succès!\n";
    }
}
