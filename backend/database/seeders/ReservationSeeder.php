<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service;
use App\Models\Reservation;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur "invité" générique pour les réservations sans compte
        $guestUser = User::firstOrCreate(
            ['email' => 'guest@odeo.com'],
            [
                'name' => 'Invité Général',
                'password' => bcrypt('guest123'),
                'role' => 'client',
                'email_verified_at' => now(),
            ]
        );

        $clients = User::where('role', 'client')->get();
        $services = Service::all();

        if ($clients->isEmpty() || $services->isEmpty()) {
            echo "❌ Veuillez d'abord créer des clients et des services\n";
            return;
        }

        $statuses = ['pending', 'confirmed', 'cancelled'];
        $reservationsData = [];

        // Créer des réservations pour les 30 derniers jours
        for ($i = 0; $i < 50; $i++) {
            $client = $clients->random();
            $service = $services->random();
            $status = $statuses[array_rand($statuses)];
            
            // Dates aléatoires des 30 derniers jours à aujourd'hui + 10 jours
            $reservationDate = Carbon::now()
                ->subDays(rand(0, 30))
                ->addDays(rand(0, 40))
                ->format('Y-m-d');

            $createdDate = Carbon::now()
                ->subDays(rand(0, 45))
                ->format('Y-m-d H:i:s');

            // Calculer le prix avec commission de 20%
            $servicePrice = $service->price;
            $commission = $servicePrice * 0.20; // 20% de commission
            $totalPrice = $servicePrice;

            $reservationData = [
                'user_id' => $client->id,
                'service_id' => $service->id,
                'agency_id' => $service->agency_id, // Ajouter l'agency_id
                'reservation_date' => $reservationDate,
                'start_time' => $reservationDate . ' ' . sprintf('%02d:00:00', rand(9, 17)),
                'number_of_people' => rand(1, min(4, $service->max_participants)),
                'total_price' => $totalPrice,
                'commission_rate' => 20.00, // 20% de commission
                'commission_amount' => $commission,
                'status' => $status,
                'payment_status' => $status === 'confirmed' ? 'paid' : 'pending',
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ];

            // Ajouter une raison d'annulation si statut = cancelled
            if ($status === 'cancelled') {
                $reasons = [
                    'Conditions météorologiques défavorables',
                    'Problème de santé du client',
                    'Changement de programme',
                    'Annulation de dernière minute',
                    'Service non disponible'
                ];
                $reservationData['cancellation_reason'] = $reasons[array_rand($reasons)];
            }

            $reservationsData[] = $reservationData;
        }

        // Créer quelques réservations d'invités (guest)
        for ($i = 0; $i < 15; $i++) {
            $service = $services->random();
            $status = $statuses[array_rand($statuses)];
            
            $reservationDate = Carbon::now()
                ->addDays(rand(1, 20))
                ->format('Y-m-d');

            $createdDate = Carbon::now()
                ->subDays(rand(0, 10))
                ->format('Y-m-d H:i:s');

            $servicePrice = $service->price;
            $commission = $servicePrice * 0.20;
            $totalPrice = $servicePrice;

            $guestNames = ['Hassan Alami', 'Nadia Berrada', 'Karim Zouaki', 'Laila Fassi', 'Rachid Bennani'];
            $guestName = $guestNames[array_rand($guestNames)];

            $reservationData = [
                'user_id' => $guestUser->id, // Utiliser l'utilisateur invité générique
                'service_id' => $service->id,
                'agency_id' => $service->agency_id, // Ajouter l'agency_id
                'reservation_date' => $reservationDate,
                'start_time' => $reservationDate . ' ' . sprintf('%02d:00:00', rand(9, 17)),
                'number_of_people' => rand(1, min(3, $service->max_participants)),
                'total_price' => $totalPrice,
                'commission_rate' => 20.00,
                'commission_amount' => $commission,
                'status' => $status,
                'payment_status' => $status === 'confirmed' ? 'paid' : 'pending',
                'special_requests' => 'Réservation invité: ' . $guestName . ' (' . strtolower(str_replace(' ', '.', $guestName)) . '@email.com)',
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ];

            if ($status === 'cancelled') {
                $reasons = [
                    'Conditions météorologiques défavorables',
                    'Problème de santé du client',
                    'Changement de programme'
                ];
                $reservationData['cancellation_reason'] = $reasons[array_rand($reasons)];
            }

            $reservationsData[] = $reservationData;
        }

        // Insérer toutes les réservations
        foreach ($reservationsData as $reservationData) {
            Reservation::create($reservationData);
        }

        $totalReservations = count($reservationsData);
        $confirmedCount = collect($reservationsData)->where('status', 'confirmed')->count();
        $totalCommission = collect($reservationsData)
            ->where('status', 'confirmed')
            ->sum('commission_amount');

        echo "✅ {$totalReservations} réservations créées avec succès!\n";
        echo "✅ {$confirmedCount} réservations confirmées\n";
        echo "💰 Commission totale admin: " . number_format($totalCommission, 2) . " DH\n";
    }
}
