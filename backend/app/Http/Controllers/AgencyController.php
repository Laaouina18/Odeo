<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agency;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class AgencyController extends Controller
{
    // Create a new agency profile
    public function store(Request $request)
    {
        try {
            // Log des données reçues
            Log::info('Agency store request:', $request->all());
            
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:agencies,email',
                'phone' => 'nullable|string',
                'description' => 'nullable|string',
                'logo' => 'nullable|string',
            ]);
            
            $data['user_id'] = Auth::id();
            
            // Log avant création
            Log::info('Creating agency with data:', $data);
            
            $agency = Agency::create($data);
            
            // Log après création
            Log::info('Agency created successfully:', ['id' => $agency->id]);
            
            return response()->json($agency, 201);
            
        } catch (Exception $e) {
            // Log de l'erreur complète
            Log::error('Error in agency store:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    // Show agency profile
    public function show()
    {
        try {
            Log::info('Agency show request for user:', ['user_id' => Auth::id()]);
            
            $agency = Agency::where('user_id', Auth::id())->first();
            
            if (!$agency) {
                Log::warning('Agency not found for user:', ['user_id' => Auth::id()]);
                return response()->json(['error' => 'Agency profile not found'], 404);
            }
            
            Log::info('Agency found:', ['agency_id' => $agency->id]);
            
            return response()->json([
                'id' => $agency->id,
                'name' => $agency->name,
                'email' => $agency->email,
                'phone' => $agency->phone,
                'description' => $agency->description,
                'logo' => $agency->logo,
                'status' => $agency->status ?? 'active',
                'created_at' => $agency->created_at,
                'updated_at' => $agency->updated_at,
            ]);
            
        } catch (Exception $e) {
            Log::error('Error in agency show:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    // Update agency profile
    public function update(Request $request, $id)
    {
        try {
            Log::info('Agency update request:', [
                'agency_id' => $id,
                'data' => $request->all()
            ]);
            $agency = Agency::find($id);
            if (!$agency) {
                Log::warning('Agency not found for update:', ['agency_id' => $id]);
                return response()->json(['error' => 'Agency profile not found'], 404);
            }
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:agencies,email,' . $agency->id,
                'phone' => 'nullable|string',
                'description' => 'nullable|string',
                'logo' => 'nullable|string',
            ]);
            Log::info('Updating agency:', ['agency_id' => $agency->id, 'data' => $data]);
            $agency->update($data);
            Log::info('Agency updated successfully:', ['agency_id' => $agency->id]);
            return response()->json($agency);
        } catch (Exception $e) {
            Log::error('Error in agency update:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'agency_id' => $id
            ]);
            return response()->json([
                'error' => 'Internal server error',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    // Delete agency profile
    public function destroy($id)
    {
        try {
            Log::info('Agency delete request:', ['agency_id' => $id]);
            $agency = Agency::find($id);
            if (!$agency) {
                Log::warning('Agency not found for deletion:', ['agency_id' => $id]);
                return response()->json(['error' => 'Agency profile not found'], 404);
            }
            Log::info('Deleting agency:', ['agency_id' => $agency->id]);
            $agency->delete();
            Log::info('Agency deleted successfully:', ['agency_id' => $agency->id]);
            return response()->json(['message' => 'Agency deleted successfully']);
        } catch (Exception $e) {
            Log::error('Error in agency destroy:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'agency_id' => $id
            ]);
            return response()->json([
                'error' => 'Internal server error',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
}