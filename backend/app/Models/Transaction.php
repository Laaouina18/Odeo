<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'agency_id', 'client_id', 'amount', 'commission', 'status'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
