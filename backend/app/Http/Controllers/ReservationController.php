<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::query()->with(['service', 'client']);
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        $reservations = $query->paginate(10);
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'client_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        $reservation = Reservation::create($data);
        return response()->json(['reservation' => $reservation], 201);
    }

    public function show($id)
    {
        $reservation = Reservation::with(['service', 'client'])->findOrFail($id);
        return response()->json(['reservation' => $reservation]);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $data = $request->validate([
            'date' => 'sometimes|required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        $reservation->update($data);
        return response()->json(['reservation' => $reservation]);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json(['message' => 'Reservation deleted']);
    }
}
