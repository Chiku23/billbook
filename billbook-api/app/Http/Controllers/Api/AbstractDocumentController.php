<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentStatusRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

abstract class AbstractDocumentController extends Controller
{
    protected string $documentType;

    public function __construct(
        protected readonly DocumentService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Document::query()
            ->ofType($this->documentType)
            ->with(['client', 'lineItems'])
            ->withStatusFilter($this->documentType, $request->query('status'))
            ->search($request->query('search'));

        if ($request->filled('clientId')) {
            $query->where('client_id', $request->query('clientId'));
        }

        if ($request->filled('from')) {
            $query->whereDate('issue_date', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('issue_date', '<=', $request->query('to'));
        }

        $sortMap = [
            'issueDate' => 'issue_date',
            'dueDate' => 'due_date',
            'validUntil' => 'valid_until',
            'number' => 'number',
            'updatedAt' => 'updated_at',
            'createdAt' => 'created_at',
        ];
        $sortColumn = $sortMap[$request->query('sort', 'issueDate')] ?? 'issue_date';
        $direction = $request->query('dir') === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortColumn, $direction)->orderByDesc('created_at');

        $counts = $this->service->statusCounts($this->documentType);

        if ($request->filled('perPage') || $request->filled('page')) {
            $perPage = max(1, min(100, (int) $request->query('perPage', 15)));

            return DocumentResource::collection($query->paginate($perPage))->additional([
                'meta' => [
                    'counts' => $counts,
                ],
            ]);
        }

        $documents = $query->get();

        return DocumentResource::collection($documents)->additional([
            'meta' => [
                'total' => $documents->count(),
                'counts' => $counts,
            ],
        ]);
    }

    public function nextNumber(): JsonResponse
    {
        return response()->json([
            'data' => [
                'number' => $this->service->generateNextNumber($this->documentType),
            ],
        ]);
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        $document = $this->service->createDocument($this->documentType, $request->validated());

        return (new DocumentResource($document))
            ->additional(['message' => ucfirst($this->documentType) . ' created successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $identifier): DocumentResource
    {
        return new DocumentResource($this->findDocument($identifier));
    }

    public function update(UpdateDocumentRequest $request, string $identifier): DocumentResource
    {
        $document = $this->findDocument($identifier);
        $updated = $this->service->updateDocument($document, $request->validated());

        return (new DocumentResource($updated))
            ->additional(['message' => ucfirst($this->documentType) . ' updated successfully.']);
    }

    public function updateStatus(UpdateDocumentStatusRequest $request, string $identifier): DocumentResource
    {
        $document = $this->findDocument($identifier);
        $updated = $this->service->updateStatus($document, $request->validated('status'));

        return (new DocumentResource($updated))
            ->additional(['message' => ucfirst($this->documentType) . ' status updated.']);
    }

    public function duplicate(string $identifier): JsonResponse
    {
        $document = $this->findDocument($identifier);
        $copy = $this->service->duplicateDocument($document);

        return (new DocumentResource($copy))
            ->additional(['message' => ucfirst($this->documentType) . ' duplicated successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(string $identifier): JsonResponse
    {
        $document = $this->findDocument($identifier);
        $document->delete();

        return response()->json([
            'message' => ucfirst($this->documentType) . ' deleted successfully.',
        ]);
    }

    protected function findDocument(string $identifier): Document
    {
        return Document::query()
            ->ofType($this->documentType)
            ->with(['client', 'lineItems'])
            ->where(function ($query) use ($identifier): void {
                $query->where('id', $identifier)->orWhere('number', $identifier);
            })
            ->firstOrFail();
    }
}
