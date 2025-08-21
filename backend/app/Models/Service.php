<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id', 
        'category_id', 
        'title', 
        'description', 
        'price', 
        'location', 
        'status',
        'dates',
        'images'
    ];

    // Cast des champs
    protected $casts = [
        'price' => 'float',
        'dates' => 'array',
        'images' => 'array',
    ];


    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
