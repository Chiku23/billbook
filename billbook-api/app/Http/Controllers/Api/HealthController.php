<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (Throwable) {
            return response()->json([
                'status' => 'error',
                'app' => config('app.name', 'BillBook API'),
                'database' => 'disconnected',
                'timestamp' => now()->toIso8601String(),
            ], 503);
        }

        return response()->json([
            'status' => 'ok',
            'app' => config('app.name', 'BillBook API'),
            'database' => $dbStatus,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
