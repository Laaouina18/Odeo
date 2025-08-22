<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Statistiques générales pour le dashboard admin
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_agencies' => User::where('role', 'agency')->count(),
                'total_clients' => User::where('role', 'client')->count(),
                'total_services' => Service::count(),
                'total_reservations' => Reservation::count(),
                'total_commission' => Reservation::where('status', 'confirmed')
                    ->sum(\DB::raw('total_price * 0.2')),
                'confirmed_reservations' => Reservation::where('status', 'confirmed')->count(),
                'pending_reservations' => Reservation::where('status', 'pending')->count(),
                'cancelled_reservations' => Reservation::where('status', 'cancelled')->count(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toutes les réservations avec détails
     */
    public function getReservations()
    {
        try {
            $reservations = Reservation::with(['user', 'service.agency'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'reservations' => $reservations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des réservations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste de tous les utilisateurs
     */
    public function getUsers()
    {
        try {
            $users = User::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste de toutes les agences
     */
    public function getAgencies()
    {
        try {
            $agencies = User::where('role', 'agency')
                ->with(['services'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'agencies' => $agencies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des agences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:client,agency,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifier un utilisateur
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:client,agency,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->role = $request->role;

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur modifié avec succès',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        try {
            // Vérifier si l'utilisateur a des réservations ou services
            if ($user->role === 'agency' && $user->services()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer une agence qui a des services'
                ], 400);
            }

            if ($user->role === 'client' && $user->reservations()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un client qui a des réservations'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Données de commission par mois
     */
    public function getCommissionData()
    {
        try {
            $commissions = Reservation::where('status', 'confirmed')
                ->selectRaw('
                    YEAR(reservation_date) as year,
                    MONTH(reservation_date) as month,
                    COUNT(*) as reservations_count,
                    SUM(total_price) as total_revenue,
                    SUM(total_price * 0.2) as commission_amount
                ')
                ->groupByRaw('YEAR(reservation_date), MONTH(reservation_date)')
                ->orderByRaw('YEAR(reservation_date), MONTH(reservation_date)')
                ->get();

            return response()->json([
                'success' => true,
                'commission_data' => $commissions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des données de commission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
