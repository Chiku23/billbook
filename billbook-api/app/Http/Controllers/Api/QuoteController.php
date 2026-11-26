<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Illuminate\Http\JsonResponse;

class QuoteController extends AbstractDocumentController
{
    protected string $documentType = Document::TYPE_QUOTE;

    public function convert(string $identifier): JsonResponse
    {
        $quote = $this->findDocument($identifier);
        $invoice = $this->service->convertQuoteToInvoice($quote);

        return (new DocumentResource($invoice))
            ->additional([
                'message' => 'Quote converted to invoice successfully.',
                'meta' => [
                    'sourceQuoteId' => $quote->id,
                    'sourceQuoteNumber' => $quote->number,
                ],
            ])
            ->response()
            ->setStatusCode(201);
    }
}
