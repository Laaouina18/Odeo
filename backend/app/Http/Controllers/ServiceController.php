<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Service::query()->with(['agency', 'category']);
            
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->has('search')) {
                $query->where('title', 'like', '%'.$request->search.'%');
            }
            
            $services = $query->paginate(10);
            
            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des services: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des services'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validation des champs
            $validated = $request->validate([
                'agency_id'   => 'required|exists:agencies,id',
                'category_id' => 'required|exists:categories,id',
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'price'       => 'required|numeric|min:0',
                'location'    => 'nullable|string',
                'status'      => 'nullable|string',
                'dates'       => 'nullable|array',
                'dates.*'     => 'string|date_format:Y-m-d',
                'images.*'    => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            // Gestion des dates
            $dates = [];
            if ($request->has('dates')) {
                $datesRaw = $request->input('dates');
                if (is_array($datesRaw)) {
                    $dates = $datesRaw;
                } else {
                    $decoded = json_decode($datesRaw, true);
                    if (is_array($decoded)) {
                        $dates = $decoded;
                    }
                }
            }
            $validated['dates'] = $dates;

            // Gestion des images multiples
            $imagesPaths = [];
            // Récupérer tous les fichiers qui commencent par "images"
            $allFiles = $request->allFiles();
            foreach ($allFiles as $key => $files) {
                if (strpos($key, 'images') === 0) {
                    if (is_array($files)) {
                        foreach ($files as $file) {
                            $path = $file->store('services', 'public');
                            $imagesPaths[] = $path;
                        }
                    } else {
                        $path = $files->store('services', 'public');
                        $imagesPaths[] = $path;
                    }
                }
            }

            $validated['status'] = $validated['status'] ?? 'inactive';
            $validated['price'] = (float) $validated['price'];
            $validated['images'] = $imagesPaths;

            $service = Service::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Service créé avec succès',
                'service' => $service->load(['agency', 'category'])
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du service: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du service'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);

            // Validation des champs (tous optionnels sauf price)
            $validated = $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'title'       => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price'       => 'sometimes|numeric|min:0',
                'location'    => 'nullable|string',
                'status'      => 'nullable|string',
                'dates'       => 'nullable|array',
                'dates.*'     => 'string|date_format:Y-m-d',
                'images'      => 'nullable|array',
                'images.*'    => 'file|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            // Gestion des dates
            if ($request->has('dates')) {
                $datesRaw = $request->input('dates');
                if (is_array($datesRaw)) {
                    $validated['dates'] = $datesRaw;
                } else {
                    $decoded = json_decode($datesRaw, true);
                    if (is_array($decoded)) {
                        $validated['dates'] = $decoded;
                    }
                }
            }

            // Gestion des images multiples
            $imagesPaths = $service->images ?? [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('services', 'public');
                    $imagesPaths[] = $path;
                }
                $validated['images'] = $imagesPaths;
            }

            if (isset($validated['price'])) {
                $validated['price'] = (float) $validated['price'];
            }

            $service->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Service mis à jour avec succès',
                'service' => $service->load(['agency', 'category'])
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service non trouvé'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du service: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du service'
            ], 500);
        }
    }


    public function show($id)
    {
        try {
            $service = Service::with(['agency', 'category', 'bookings'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'service' => $service
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service non trouvé'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du service: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du service'
            ], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            
            // Suppression des images supprimée
            
            $service->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Service supprimé avec succès'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service non trouvé'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du service: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du service'
            ], 500);
        }
    }

    // Méthodes spécifiques pour les agences
    public function getAgencyServices($agencyId)
    {
        try {
            $services = Service::with(['category'])
                              ->where('agency_id', $agencyId)
                              ->orderBy('created_at', 'desc')
                              ->get();
            
            return response()->json([
                'success' => true,
                'services' => $services
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des services de l\'agence: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des services'
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->status = $service->status === 'active' ? 'inactive' : 'active';
            $service->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Statut du service modifié avec succès',
                'service' => $service
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la modification du statut: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification du statut'
            ], 500);
        }
    }

    public function getServiceStats($id)
    {
        try {
            $service = Service::with('reservations')->findOrFail($id);
            
            $stats = [
                'total_reservations' => $service->reservations()->count(),
                'confirmed_reservations' => $service->reservations()->where('status', 'confirmed')->count(),
                'pending_reservations' => $service->reservations()->where('status', 'pending')->count(),
                'cancelled_reservations' => $service->reservations()->where('status', 'cancelled')->count(),
                'total_revenue' => $service->reservations()->where('status', 'confirmed')->sum('total_price'),
                'average_rating' => 4.2, // À implémenter avec un système de notation
            ];
            
            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques'
            ], 500);
        }
    }

    public function getServiceWithDates($id)
    {
        try {
            $service = Service::with(['category', 'agency'])->findOrFail($id);
            
            // Générer les créneaux disponibles pour les 30 prochains jours
            $availableDates = [];
            $startDate = now();
            
            for ($i = 0; $i < 30; $i++) {
                $date = $startDate->copy()->addDays($i);
                
                // Créneaux horaires par défaut (9h-17h)
                $timeSlots = [];
                for ($hour = 9; $hour <= 17; $hour++) {
                    $timeSlot = $date->copy()->setTime($hour, 0);
                    
                    // Vérifier si le créneau est déjà réservé
                    $isBooked = $service->reservations()
                                      ->where('reservation_date', $date->toDateString())
                                      ->where('start_time', $timeSlot->format('H:i'))
                                      ->whereIn('status', ['pending', 'confirmed'])
                                      ->exists();
                    
                    if (!$isBooked) {
                        $timeSlots[] = $timeSlot->format('H:i');
                    }
                }
                
                if (!empty($timeSlots)) {
                    $availableDates[] = [
                        'date' => $date->toDateString(),
                        'timeSlots' => $timeSlots
                    ];
                }
            }
            
            return response()->json([
                'success' => true,
                'service' => $service,
                'availableDates' => $availableDates
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du service avec dates: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du service'
            ], 500);
        }
    }
}
