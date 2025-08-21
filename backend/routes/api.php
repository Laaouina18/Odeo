<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

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
Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
Route::get('/me', [App\Http\Controllers\AuthController::class, 'me']);

// Services
Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index']);
Route::get('/services/{id}', [App\Http\Controllers\ServiceController::class, 'show']);
Route::post('/services', [App\Http\Controllers\ServiceController::class, 'store']);
Route::put('/services/{id}', [App\Http\Controllers\ServiceController::class, 'update']);
Route::delete('/services/{id}', [App\Http\Controllers\ServiceController::class, 'destroy']);

// Bookings
Route::post('/bookings', [App\Http\Controllers\BookingController::class, 'store']);
Route::get('/bookings', [App\Http\Controllers\BookingController::class, 'index']);
Route::get('/bookings/{id}', [App\Http\Controllers\BookingController::class, 'show']);
Route::put('/bookings/{id}/status', [App\Http\Controllers\BookingController::class, 'updateStatus']);

// Réservations publiques (sans authentification)
Route::post('/reservations/public', [ReservationController::class, 'storePublic']);
Route::get('/reservations/public/{id}', [ReservationController::class, 'showPublic']);

Route::get('/reservations', [ReservationController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/reservations/{id}', [ReservationController::class, 'show']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);


// Profile CRUD
// Agency profile (public)
Route::get('/agency/profile', [App\Http\Controllers\AgencyController::class, 'show']);
Route::put('/agency/profile/{id}', [App\Http\Controllers\AgencyController::class, 'update']);
Route::delete('/agency/profile/{id}', [App\Http\Controllers\AgencyController::class, 'destroy']);
// Client profile (public)
Route::get('/client/profile/{id}', [App\Http\Controllers\UserController::class, 'show']);
Route::put('/client/profile/{id}', [App\Http\Controllers\UserController::class, 'update']);
Route::delete('/client/profile/{id}', [App\Http\Controllers\UserController::class, 'destroy']);

// Analytics
Route::get('/analytics/agencies-revenue', [App\Http\Controllers\AnalyticsController::class, 'agenciesRevenue']);
Route::get('/analytics/clients-evolution', [App\Http\Controllers\AnalyticsController::class, 'clientsEvolution']);
Route::get('/analytics/dashboard-stats', [App\Http\Controllers\AnalyticsController::class, 'dashboardStats']);
Route::get('/categories', [CategoryController::class, 'index']);

// Reservations - Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('reservations', ReservationController::class);
    Route::post('/reservations/{id}/confirm', [ReservationController::class, 'confirm']);
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::get('/reservations-stats', [ReservationController::class, 'stats']);
});
