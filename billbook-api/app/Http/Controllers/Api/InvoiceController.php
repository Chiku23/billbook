<?php

namespace App\Http\Controllers\Api;

use App\Models\Document;
use App\Services\BackupService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InvoiceController extends AbstractDocumentController
{
    protected string $documentType = Document::TYPE_INVOICE;

    public function exportCsv(Request $request, BackupService $backup): StreamedResponse
    {
        return $backup->streamInvoicesCsv(
            is_string($request->query('status')) ? $request->query('status') : null,
            is_string($request->query('search')) ? $request->query('search') : null,
        );
    }
}
