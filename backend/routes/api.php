<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// Auth
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/me', [App\Http\Controllers\AuthController::class, 'me']);

// Services
Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index']);
Route::get('/services/{id}', [App\Http\Controllers\ServiceController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/services', [App\Http\Controllers\ServiceController::class, 'store']);
    Route::put('/services/{id}', [App\Http\Controllers\ServiceController::class, 'update']);
    Route::delete('/services/{id}', [App\Http\Controllers\ServiceController::class, 'destroy']);
});

// Bookings
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [App\Http\Controllers\BookingController::class, 'store']);
    Route::get('/bookings', [App\Http\Controllers\BookingController::class, 'index']);
    Route::get('/bookings/{id}', [App\Http\Controllers\BookingController::class, 'show']);
    Route::put('/bookings/{id}/status', [App\Http\Controllers\BookingController::class, 'updateStatus']);
});

// Payment
Route::middleware('auth:sanctum')->post('/payment', [App\Http\Controllers\PaymentController::class, 'processPayment']);
Route::middleware('auth:sanctum')->get('/invoice/{bookingId}', [App\Http\Controllers\PaymentController::class, 'generateInvoice']);

// Analytics
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/analytics/agencies-revenue', [App\Http\Controllers\AnalyticsController::class, 'agenciesRevenue']);
    Route::get('/analytics/clients-evolution', [App\Http\Controllers\AnalyticsController::class, 'clientsEvolution']);
    Route::get('/analytics/dashboard-stats', [App\Http\Controllers\AnalyticsController::class, 'dashboardStats']);
});
