<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AbsenceController extends Controller
{
    /**
     * Lister les absences avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
            'status' => 'nullable|in:pending_review,validated,rejected',
            'absence_type' => 'nullable|in:justified,unjustified,authorized',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'requiring_attention' => 'nullable|boolean',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Absence::with(['employee', 'validator']);

        // Filtres
        if ($request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->absence_type) {
            $query->where('absence_type', $request->absence_type);
        }

        if ($request->start_date) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->where('end_date', '<=', $request->end_date);
        }

        if ($request->boolean('requiring_attention')) {
            $query->where(function ($q) {
                $q->where('absence_type', 'unjustified')
                  ->orWhere(function ($subQuery) {
                      $subQuery->where('medical_certificate_required', true)
                               ->where('medical_certificate_provided', false);
                  })
                  ->orWhere('disciplinary_action', true);
            });
        }

        // Tri par défaut
        $query->orderBy('start_date', 'desc');

        $perPage = $request->get('per_page', 15);
        $absences = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $absences->items(),
            'pagination' => [
                'current_page' => $absences->currentPage(),
                'last_page' => $absences->lastPage(),
                'per_page' => $absences->perPage(),
                'total' => $absences->total(),
            ],
        ]);
    }

    /**
     * Déclarer une absence
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'reason' => 'nullable|string|max:1000',
            'is_sick' => 'nullable|boolean',
            'justification_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        try {
            // Calculer la durée en heures
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate = \Carbon\Carbon::parse($request->end_date);
            
            $durationHours = 8; // Par défaut, journée complète
            if ($request->start_time && $request->end_time) {
                $startTime = \Carbon\Carbon::parse($request->start_time);
                $endTime = \Carbon\Carbon::parse($request->end_time);
                $durationHours = $endTime->diffInHours($startTime);
            } else {
                $durationHours = ($endDate->diffInDays($startDate) + 1) * 8;
            }

            $absenceData = [
                'employee_id' => $request->employee_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'duration_hours' => $durationHours,
                'reason' => $request->reason,
                'is_sick' => $request->boolean('is_sick'),
            ];

            $absence = Absence::declareAbsence($absenceData);

            // Gérer le fichier justificatif si fourni
            if ($request->hasFile('justification_file')) {
                $file = $request->file('justification_file');
                $fileName = 'absence_' . $absence->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('absences/justifications', $fileName, 'public');
                
                $absence->uploadJustification($filePath);
            }

            return response()->json([
                'success' => true,
                'message' => 'Absence déclarée avec succès',
                'data' => $absence->load('employee'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déclaration: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Afficher une absence spécifique
     */
    public function show(string $id): JsonResponse
    {
        $absence = Absence::with(['employee', 'validator'])->find($id);

        if (!$absence) {
            return response()->json([
                'success' => false,
                'message' => 'Absence non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $absence,
        ]);
    }

    /**
     * Valider/rejeter une absence (Manager/RH)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:validate,reject',
            'decision' => 'required_if:action,validate|in:validated,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $absence = Absence::find($id);

        if (!$absence) {
            return response()->json([
                'success' => false,
                'message' => 'Absence non trouvée',
            ], 404);
        }

        try {
            if ($request->action === 'validate') {
                $success = $absence->validate(auth()->user(), $request->decision, $request->notes);
                
                if ($success) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Absence ' . ($request->decision === 'validated' ? 'validée' : 'rejetée') . ' avec succès',
                        'data' => $absence->fresh(['employee', 'validator']),
                    ]);
                }
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer une absence (Admin uniquement)
     */
    public function destroy(string $id): JsonResponse
    {
        $absence = Absence::find($id);

        if (!$absence) {
            return response()->json([
                'success' => false,
                'message' => 'Absence non trouvée',
            ], 404);
        }

        $absence->delete();

        return response()->json([
            'success' => true,
            'message' => 'Absence supprimée avec succès',
        ]);
    }
}