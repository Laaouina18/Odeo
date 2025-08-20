<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $baseRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:client,agency,admin',
        ];
        $agencyRules = [
            'agency_name' => 'required_if:role,agency|string|max:255',
            'agency_email' => 'required_if:role,agency|email',
            'agency_phone' => 'nullable|string',
            'agency_description' => 'nullable|string',
        ];
        $rules = array_merge($baseRules, $agencyRules);
        $data = $request->validate($rules);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        if ($data['role'] === 'agency') {
            $agency = \App\Models\Agency::create([
                'user_id' => $user->id,
                'name' => $data['agency_name'],
                'email' => $data['agency_email'],
                'phone' => $data['agency_phone'] ?? null,
                'description' => $data['agency_description'] ?? null,
                'status' => 'pending',
            ]);
            return response()->json(['user' => $user, 'agency' => $agency], 201);
        }

        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('authToken')->plainTextToken;
        $response = [
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ];
        if ($user->role === 'agency') {
            $response['agency'] = $user->agency;
        }
        return response()->json($response);
    }

    public function logout(Request $request)
    {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
    return response()->json(['user' => $request->user()]);
    }
}
