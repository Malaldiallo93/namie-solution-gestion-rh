<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeavePeriod;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeavePeriodController extends Controller
{
    /**
     * Lister toutes les périodes de référence
     */
    public function index(): JsonResponse
    {
        $periods = LeavePeriod::orderBy('year', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $periods,
        ]);
    }

    /**
     * Créer une nouvelle période
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:2030|unique:leave_periods,year',
        ]);

        $period = LeavePeriod::createPeriod($request->year);

        return response()->json([
            'success' => true,
            'data' => $period,
            'message' => 'Période créée avec succès',
        ], 201);
    }

    /**
     * Afficher une période spécifique
     */
    public function show(string $id): JsonResponse
    {
        $period = LeavePeriod::find($id);

        if (!$period) {
            return response()->json([
                'success' => false,
                'message' => 'Période non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $period,
        ]);
    }

    /**
     * Mettre à jour une période
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $period = LeavePeriod::find($id);

        if (!$period) {
            return response()->json([
                'success' => false,
                'message' => 'Période non trouvée',
            ], 404);
        }

        $request->validate([
            'min_summer_days' => 'integer|min:1|max:30',
            'is_active' => 'boolean',
            'company_closures' => 'array',
            'public_holidays' => 'array',
        ]);

        $period->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $period,
            'message' => 'Période mise à jour avec succès',
        ]);
    }

    /**
     * Supprimer une période
     */
    public function destroy(string $id): JsonResponse
    {
        $period = LeavePeriod::find($id);

        if (!$period) {
            return response()->json([
                'success' => false,
                'message' => 'Période non trouvée',
            ], 404);
        }

        $period->delete();

        return response()->json([
            'success' => true,
            'message' => 'Période supprimée avec succès',
        ]);
    }
}