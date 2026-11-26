<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboard): JsonResponse
    {
        $month = $request->query('month');
        $months = (int) $request->query('months', 6);

        return response()->json([
            'data' => $dashboard->summary(
                is_string($month) ? $month : null,
                $months > 0 ? $months : 6,
            ),
        ]);
    }
}
