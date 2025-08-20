<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'booking_id' => 'required|exists:bookings,id',
            'card_number' => 'required|string',
            'card_name' => 'required|string',
            'card_expiry' => 'required|string',
            'card_cvc' => 'required|string',
        ];
    }
}
