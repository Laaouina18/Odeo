<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'card_number' => 'required|string',
            'card_name' => 'required|string',
            'card_expiry' => 'required|string',
            'card_cvc' => 'required|string',
        ]);
        // Simulation paiement
        $booking = Booking::findOrFail($data['booking_id']);
        $booking->status = 'confirmed';
        $booking->save();
        // Générer transaction et commission ici
        return response()->json(['message' => 'Paiement simulé, réservation confirmée']);
    }

    public function generateInvoice($bookingId)
    {
    $booking = Booking::findOrFail($bookingId);
    // Simulation génération PDF
    $pdfPath = 'invoices/invoice_' . $bookingId . '.pdf';
    // En vrai, utiliser dompdf ou snappy pour générer le PDF
    $booking->invoice()->create(['pdf_path' => $pdfPath]);
    return response()->json(['pdf' => $pdfPath]);
    }
}
