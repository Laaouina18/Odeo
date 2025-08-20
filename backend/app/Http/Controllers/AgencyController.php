<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agency;
use Illuminate\Support\Facades\Auth;

class AgencyController extends Controller
{
    public function show()
    {
        $agency = Agency::where('user_id', Auth::id())->firstOrFail();
        return response()->json($agency);
    }

    public function update(Request $request)
    {
        $agency = Agency::where('user_id', Auth::id())->firstOrFail();
        $data = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $agency->update($data);
        return response()->json($agency);
    }

    public function destroy()
    {
        $agency = Agency::where('user_id', Auth::id())->firstOrFail();
        $agency->delete();
        return response()->json(['message' => 'Agency deleted']);
    }
}
