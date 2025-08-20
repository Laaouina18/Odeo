<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function agenciesRevenue(Request $request)
    {
        // Simulation: retourne CA par agence
        $revenues = \App\Models\Agency::with('services.bookings')->get()->map(function($agency) {
            $ca = $agency->services->flatMap->bookings->sum('total_price');
            return [
                'agency' => $agency->name,
                'revenue' => $ca,
            ];
        });
        return response()->json(['revenues' => $revenues]);
    }

    public function clientsEvolution(Request $request)
    {
    // Simulation: retourne nombre de clients par mois
    $clients = \App\Models\User::clients()->selectRaw('MONTH(created_at) as month, COUNT(*) as count')->groupBy('month')->get();
    return response()->json(['clients' => $clients]);
    }

    public function dashboardStats(Request $request)
    {
        $agenciesCount = \App\Models\Agency::count();
        $clientsCount = \App\Models\User::clients()->count();
        $bookingsCount = \App\Models\Booking::count();
        $caTotal = \App\Models\Booking::sum('total_price');
        return response()->json([
            'agencies' => $agenciesCount,
            'clients' => $clientsCount,
            'bookings' => $bookingsCount,
            'ca_total' => $caTotal,
        ]);
    }
}
