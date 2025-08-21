<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Reservation::with(['user', 'service', 'agency']);

        // Filtrer selon le rôle de l'utilisateur
        if ($user->role === 'client') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'agency') {
            $query->where('agency_id', $user->agency_id);
        }

        // Filtres optionnels
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }
        if ($request->has('date_from')) {
            $query->whereDate('reservation_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('reservation_date', '<=', $request->date_to);
        }

        $reservations = $query->orderBy('reservation_date', 'desc')->paginate(10);
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'reservation_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'number_of_people' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:1000',
            'payment_method' => 'nullable|string'
        ]);

        // Récupérer le service pour calculer le prix et l'agence
        $service = Service::findOrFail($data['service_id']);
        
        $totalPrice = $service->price * $data['number_of_people'];
        $commissionRate = 10.00; // 10% de commission
        $commissionAmount = $totalPrice * ($commissionRate / 100);

        $reservation = Reservation::create([
            'user_id' => $user->id,
            'service_id' => $data['service_id'],
            'agency_id' => $service->agency_id,
            'reservation_date' => $data['reservation_date'],
            'start_time' => $data['reservation_date'] . ' ' . $data['start_time'],
            'end_time' => isset($data['end_time']) ? $data['reservation_date'] . ' ' . $data['end_time'] : null,
            'number_of_people' => $data['number_of_people'],
            'total_price' => $totalPrice,
            'special_requests' => $data['special_requests'] ?? null,
            'payment_method' => $data['payment_method'] ?? null,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'reservation' => $reservation->load(['service', 'agency'])
        ], 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $query = Reservation::with(['user', 'service', 'agency']);
        
        if ($user->role === 'client') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'agency') {
            $query->where('agency_id', $user->agency_id);
        }
        
        $reservation = $query->findOrFail($id);
        return response()->json(['reservation' => $reservation]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $reservation = Reservation::findOrFail($id);

        // Vérifier les permissions
        if ($user->role === 'client' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        if ($user->role === 'agency' && $reservation->agency_id !== $user->agency_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $rules = [];
        
        if ($user->role === 'client') {
            // Les clients peuvent modifier certains champs si la réservation est en attente
            if ($reservation->status === 'pending') {
                $rules = [
                    'reservation_date' => 'sometimes|date|after_or_equal:today',
                    'start_time' => 'sometimes|date_format:H:i',
                    'end_time' => 'sometimes|nullable|date_format:H:i|after:start_time',
                    'number_of_people' => 'sometimes|integer|min:1|max:20',
                    'special_requests' => 'sometimes|nullable|string|max:1000'
                ];
            } else {
                return response()->json(['message' => 'Vous ne pouvez plus modifier cette réservation'], 400);
            }
        } elseif ($user->role === 'agency') {
            // Les agences peuvent modifier le statut et d'autres champs
            $rules = [
                'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
                'payment_status' => ['sometimes', Rule::in(['pending', 'paid', 'refunded'])]
            ];
        }

        $data = $request->validate($rules);

        // Recalculer le prix si nécessaire
        if (isset($data['number_of_people'])) {
            $service = $reservation->service;
            $totalPrice = $service->price * $data['number_of_people'];
            $data['total_price'] = $totalPrice;
            $data['commission_amount'] = $totalPrice * ($reservation->commission_rate / 100);
        }

        $reservation->update($data);

        return response()->json([
            'message' => 'Réservation mise à jour avec succès',
            'reservation' => $reservation->load(['user', 'service', 'agency'])
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $reservation = Reservation::findOrFail($id);

        // Vérifier les permissions
        if ($user->role === 'client' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        if ($user->role === 'agency' && $reservation->agency_id !== $user->agency_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // On ne supprime pas vraiment, on annule
        $reservation->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Réservation annulée avec succès']);
    }

    // Méthodes spéciales pour les agences
    public function confirm($id)
    {
        $user = Auth::user();
        if ($user->role !== 'agency') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $reservation = Reservation::where('agency_id', $user->agency_id)->findOrFail($id);
        $reservation->update(['status' => 'confirmed']);

        return response()->json([
            'message' => 'Réservation confirmée',
            'reservation' => $reservation->load(['user', 'service'])
        ]);
    }

    public function cancel($id)
    {
        $user = Auth::user();
        $reservation = Reservation::findOrFail($id);

        if ($user->role === 'client' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        if ($user->role === 'agency' && $reservation->agency_id !== $user->agency_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Réservation annulée',
            'reservation' => $reservation->load(['user', 'service', 'agency'])
        ]);
    }

    // Statistiques pour les agences
    public function stats()
    {
        $user = Auth::user();
        if ($user->role !== 'agency') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $stats = [
            'total' => Reservation::where('agency_id', $user->agency_id)->count(),
            'pending' => Reservation::where('agency_id', $user->agency_id)->pending()->count(),
            'confirmed' => Reservation::where('agency_id', $user->agency_id)->confirmed()->count(),
            'cancelled' => Reservation::where('agency_id', $user->agency_id)->cancelled()->count(),
            'revenue' => Reservation::where('agency_id', $user->agency_id)
                        ->where('status', 'completed')
                        ->sum('total_price'),
            'commission_due' => Reservation::where('agency_id', $user->agency_id)
                              ->where('status', 'completed')
                              ->sum('commission_amount')
        ];

        return response()->json(['stats' => $stats]);
    }

    public function storePublic(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'service_id' => 'required|exists:services,id',
            'reservation_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'number_of_people' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:1000',
        ]);

        // Récupérer le service pour calculer le prix et l'agence
        $service = Service::with(['agency', 'category'])->findOrFail($data['service_id']);
        
        $totalPrice = $service->price * $data['number_of_people'];
        $commissionRate = 10.00; // 10% de commission
        $commissionAmount = $totalPrice * ($commissionRate / 100);

        $reservation = Reservation::create([
            'user_id' => null, // Réservation sans compte utilisateur
            'service_id' => $data['service_id'],
            'agency_id' => $service->agency_id,
            'guest_name' => $data['name'],
            'guest_email' => $data['email'],
            'guest_phone' => $data['phone'] ?? null,
            'reservation_date' => $data['reservation_date'],
            'start_time' => $data['reservation_date'] . ' ' . $data['start_time'],
            'number_of_people' => $data['number_of_people'],
            'total_price' => $totalPrice,
            'special_requests' => $data['special_requests'] ?? null,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'status' => 'confirmed' // Confirmation automatique
        ]);

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'reservation' => $reservation->load(['service.agency', 'service.category'])
        ], 201);
    }

    public function showPublic($id)
    {
        $reservation = Reservation::with(['service.agency', 'service.category'])
                                  ->findOrFail($id);
        
        return response()->json(['reservation' => $reservation]);
    }
}
