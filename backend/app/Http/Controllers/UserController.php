<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show()
    {
        $user = User::findOrFail(Auth::id());
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = User::findOrFail(Auth::id());
        $data = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email',
        ]);
        $user->update($data);
        return response()->json($user);
    }

    public function destroy()
    {
        $user = User::findOrFail(Auth::id());
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
