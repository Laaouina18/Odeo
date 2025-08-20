<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()->with(['agency', 'category']);
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }
        $services = $query->paginate(10);
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agency_id' => 'required|exists:agencies,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'location' => 'nullable|string',
            'images' => 'nullable|array',
        ]);
        $service = Service::create($data);
        return response()->json(['service' => $service], 201);
    }

    public function show($id)
    {
    $service = Service::with(['agency', 'category', 'bookings'])->findOrFail($id);
    return response()->json(['service' => $service]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'location' => 'nullable|string',
            'images' => 'nullable|array',
            'status' => 'nullable|string',
        ]);
        $service->update($data);
        return response()->json(['service' => $service]);
    }

    public function destroy($id)
    {
    $service = Service::findOrFail($id);
    $service->delete();
    return response()->json(['message' => 'Service deleted']);
    }
}
