<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backup\ImportBackupRequest;
use App\Services\BackupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BackupController extends Controller
{
    public function export(Request $request, BackupService $backup): JsonResponse
    {
        $payload = $backup->exportPayload();
        $headers = [];

        if ($request->boolean('download')) {
            $filename = sprintf('billbook-backup-%s.json', now()->format('Y-m-d'));
            $headers['Content-Disposition'] = 'attachment; filename="' . $filename . '"';
        }

        return response()->json($payload, 200, $headers);
    }

    public function import(ImportBackupRequest $request, BackupService $backup): JsonResponse
    {
        $payload = null;

        if ($request->hasFile('file')) {
            $decoded = json_decode((string) $request->file('file')->get(), true);
            if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
                return response()->json([
                    'message' => 'Invalid JSON backup file.',
                    'errors' => [
                        'file' => ['The uploaded file must contain valid JSON.'],
                    ],
                ], 422);
            }
            $payload = $decoded;
        } else {
            $payload = $request->all();
        }

        $dataBlock = $payload['data'] ?? $payload;
        $hasSupportedKey = is_array($dataBlock) && (
            array_key_exists('invoices', $dataBlock)
            || array_key_exists('quotes', $dataBlock)
            || array_key_exists('clients', $dataBlock)
            || array_key_exists('items', $dataBlock)
            || array_key_exists('expenses', $dataBlock)
            || array_key_exists('settings', $dataBlock)
        );

        if (! $hasSupportedKey) {
            return response()->json([
                'message' => 'Backup payload is missing BillBook data collections.',
                'errors' => [
                    'data' => ['Expected invoices, quotes, clients, items, expenses, or settings.'],
                ],
            ], 422);
        }

        $mode = $request->input('mode', 'replace');
        $counts = $backup->importPayload($payload, is_string($mode) ? $mode : 'replace');

        return response()->json([
            'message' => 'Backup restored successfully.',
            'data' => [
                'mode' => $mode,
                'imported' => $counts,
            ],
        ]);
    }
}
