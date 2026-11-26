<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Client::query()
            ->search($request->query('search'))
            ->withCount(['invoices', 'quotes'])
            ->with(['invoices.lineItems']);

        $sortField = $request->query('sort') === 'createdAt' ? 'created_at' : 'name';
        $direction = $request->query('dir') === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortField, $direction);

        if ($request->filled('perPage') || $request->filled('page')) {
            $perPage = max(1, min(100, (int) $request->query('perPage', 15)));

            return ClientResource::collection($query->paginate($perPage));
        }

        $clients = $query->get();

        return ClientResource::collection($clients)->additional([
            'meta' => [
                'total' => $clients->count(),
            ],
        ]);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $data = $request->validated();

        $client = Client::query()->create([
            'name' => $data['name'],
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? '',
            'address' => $data['address'] ?? '',
            'tax_id' => $data['taxId'] ?? '',
        ]);

        $client->loadCount(['invoices', 'quotes'])->load('invoices.lineItems');

        return (new ClientResource($client))
            ->additional(['message' => 'Client created successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Client $client): ClientResource
    {
        $client->loadCount(['invoices', 'quotes'])->load([
            'invoices' => fn ($q) => $q->with('lineItems')->orderByDesc('issue_date'),
            'quotes' => fn ($q) => $q->with('lineItems')->orderByDesc('issue_date'),
        ]);

        return new ClientResource($client);
    }

    public function update(UpdateClientRequest $request, Client $client): ClientResource
    {
        $data = $request->validated();
        $updates = [];

        foreach (['name', 'email', 'phone', 'address'] as $field) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = $data[$field] ?? '';
            }
        }

        if (array_key_exists('taxId', $data)) {
            $updates['tax_id'] = $data['taxId'] ?? '';
        }

        if ($updates !== []) {
            $client->update($updates);
        }

        $client->loadCount(['invoices', 'quotes'])->load('invoices.lineItems');

        return (new ClientResource($client))
            ->additional(['message' => 'Client updated successfully.']);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully.',
        ]);
    }
}
