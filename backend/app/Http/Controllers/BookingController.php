<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'people_count' => 'required|integer|min:1',
            'options' => 'nullable|array',
        ]);
        $data['client_id'] = $request->user()->id;
        $data['total_price'] = 0; // À calculer selon le service et options
        $booking = Booking::create($data);
        return response()->json(['booking' => $booking], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'agency') {
            $bookings = Booking::whereHas('service', function($q) use ($user) {
                $q->where('agency_id', $user->agency->id);
            })->get();
        } else {
            $bookings = Booking::where('client_id', $user->id)->get();
        }
        return response()->json(['bookings' => $bookings]);
    }

    public function show($id)
    {
    $booking = Booking::with(['service', 'client', 'transaction', 'invoice'])->findOrFail($id);
    return response()->json(['booking' => $booking]);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|string',
        ]);
        $booking->status = $data['status'];
        $booking->save();
        return response()->json(['booking' => $booking]);
    }
}
