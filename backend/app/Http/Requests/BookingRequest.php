<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'people_count' => 'required|integer|min:1',
            'options' => 'nullable|array',
        ];
    }
}
