<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Requests\UpdatePlayerRequest;
use App\Models\Player;
use Illuminate\Http\Request;
use App\Http\Resources\PlayerResource;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', 'in:active,inactive'],
            'sort' => ['nullable', 'string', 'max:30'],
            'order' => ['nullable', 'in:asc,desc'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $limit = $data['limit'] ?? 25;
        $order = $data['order'] ?? 'asc';

        $sortMap = [
            'lastName' => 'last_name',
            'firstName' => 'first_name',
            'position' => 'position',
            'jerseyNumber' => 'jersey_number',
            'status' => 'status',
        ];
        $sortKey = $data['sort'] ?? 'last_name';
        $sortCol = $sortMap[$sortKey] ?? 'last_name';

        $q = Player::query()
            ->when(($data['search'] ?? null), function ($query, $search) {
                $search = trim($search);
                $query->where(function ($w) use ($search) {
                    $w->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->when(($data['position'] ?? null), fn ($query, $pos) => $query->where('position', strtoupper($pos)))
            ->when(($data['status'] ?? null), fn ($query, $status) => $query->where('status', $status))
            ->orderBy($sortCol, $order)
            ->orderBy('id', 'asc');

        return PlayerResource::collection($q->paginate($limit));
    }

    public function store(StorePlayerRequest $request)
    {
        $player = Player::query()->create($request->validated());
        return (new PlayerResource($player))->response()->setStatusCode(201);
    }

    public function show(Player $player)
    {
        return new PlayerResource($player);
    }

    public function update(UpdatePlayerRequest $request, Player $player)
    {
        $player->update($request->validated());
        return new PlayerResource($player);
    }

    public function destroy(Player $player)
    {
        $player->delete();
        return response()->noContent();
    }
}
