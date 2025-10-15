<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeaveRuleController extends Controller
{
    /**
     * Lister toutes les règles de congés
     */
    public function index(): JsonResponse
    {
        $rules = LeaveRule::orderBy('leave_type')->orderBy('rule_name')->get();

        return response()->json([
            'success' => true,
            'data' => $rules,
        ]);
    }

    /**
     * Créer une nouvelle règle
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'leave_type' => 'required|in:annual,sick,maternity,paternity,unpaid,rtt,exceptional',
            'rule_name' => 'required|string|max:255',
            'description' => 'required|string',
            'max_consecutive_days' => 'nullable|integer|min:1',
            'advance_notice_days' => 'required|integer|min:0',
            'requires_hr_approval' => 'boolean',
            'requires_manager_approval' => 'boolean',
            'max_per_year' => 'nullable|integer|min:1',
            'requires_medical_certificate' => 'boolean',
            'medical_certificate_after_days' => 'nullable|integer|min:1',
        ]);

        $rule = LeaveRule::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $rule,
            'message' => 'Règle créée avec succès',
        ], 201);
    }

    /**
     * Afficher une règle spécifique
     */
    public function show(string $id): JsonResponse
    {
        $rule = LeaveRule::find($id);

        if (!$rule) {
            return response()->json([
                'success' => false,
                'message' => 'Règle non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rule,
        ]);
    }

    /**
     * Mettre à jour une règle
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $rule = LeaveRule::find($id);

        if (!$rule) {
            return response()->json([
                'success' => false,
                'message' => 'Règle non trouvée',
            ], 404);
        }

        $request->validate([
            'rule_name' => 'string|max:255',
            'description' => 'string',
            'max_consecutive_days' => 'nullable|integer|min:1',
            'advance_notice_days' => 'integer|min:0',
            'requires_hr_approval' => 'boolean',
            'requires_manager_approval' => 'boolean',
            'max_per_year' => 'nullable|integer|min:1',
            'requires_medical_certificate' => 'boolean',
            'medical_certificate_after_days' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $rule->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $rule,
            'message' => 'Règle mise à jour avec succès',
        ]);
    }

    /**
     * Supprimer une règle
     */
    public function destroy(string $id): JsonResponse
    {
        $rule = LeaveRule::find($id);

        if (!$rule) {
            return response()->json([
                'success' => false,
                'message' => 'Règle non trouvée',
            ], 404);
        }

        $rule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Règle supprimée avec succès',
        ]);
    }
}