<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemTemplateRequest;
use App\Http\Requests\Item\UpdateItemTemplateRequest;
use App\Http\Resources\ItemTemplateResource;
use App\Models\ItemTemplate;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ItemTemplateController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ItemTemplate::query()
            ->search($request->query('search'))
            ->orderBy('name');

        if ($request->filled('perPage') || $request->filled('page')) {
            $perPage = max(1, min(100, (int) $request->query('perPage', 20)));

            return ItemTemplateResource::collection($query->paginate($perPage));
        }

        $items = $query->get();

        return ItemTemplateResource::collection($items)->additional([
            'meta' => [
                'total' => $items->count(),
            ],
        ]);
    }

    public function store(StoreItemTemplateRequest $request): JsonResponse
    {
        $data = $request->validated();
        $settings = Setting::current();

        $item = ItemTemplate::query()->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'default_rate' => (float) $data['defaultRate'],
            'default_tax_percent' => (float) ($data['defaultTaxPercent'] ?? $settings->default_tax_percent ?? 18),
            'unit' => $data['unit'] ?? 'unit',
        ]);

        return (new ItemTemplateResource($item))
            ->additional(['message' => 'Item template created successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(ItemTemplate $item): ItemTemplateResource
    {
        return new ItemTemplateResource($item);
    }

    public function update(UpdateItemTemplateRequest $request, ItemTemplate $item): ItemTemplateResource
    {
        $data = $request->validated();
        $updates = [];

        if (array_key_exists('name', $data)) {
            $updates['name'] = $data['name'];
        }
        if (array_key_exists('description', $data)) {
            $updates['description'] = $data['description'] ?? '';
        }
        if (array_key_exists('defaultRate', $data)) {
            $updates['default_rate'] = (float) $data['defaultRate'];
        }
        if (array_key_exists('defaultTaxPercent', $data)) {
            $updates['default_tax_percent'] = (float) ($data['defaultTaxPercent'] ?? 0);
        }
        if (array_key_exists('unit', $data)) {
            $updates['unit'] = $data['unit'] ?? 'unit';
        }

        if ($updates !== []) {
            $item->update($updates);
        }

        return (new ItemTemplateResource($item))
            ->additional(['message' => 'Item template updated successfully.']);
    }

    public function destroy(ItemTemplate $item): JsonResponse
    {
        $item->delete();

        return response()->json([
            'message' => 'Item template deleted successfully.',
        ]);
    }
}
