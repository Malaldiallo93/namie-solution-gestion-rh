<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request;
use App\Models\Employee;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    /**
     * Afficher toutes les demandes avec filtres
     */
    public function index(HttpRequest $request): JsonResponse
    {
        try {
            $query = Request::with(['employee', 'manager', 'hr', 'finance', 'processedBy']);

            // Filtres
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('employee_id')) {
                $query->where('employee_id', $request->employee_id);
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Tri
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $requests = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $requests,
                'message' => 'Demandes récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une nouvelle demande
     */
    public function store(HttpRequest $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'employee_id' => 'required|exists:employees,id',
                'type' => 'required|in:leave,expense,document,equipment,training,overtime,advance,other',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'sometimes|in:low,medium,high,urgent',
                'amount' => 'nullable|numeric|min:0',
                'currency' => 'sometimes|string|size:3',
                'requested_date' => 'nullable|date|after_or_equal:today',
                'end_date' => 'nullable|date|after_or_equal:requested_date',
                'due_date' => 'nullable|date|after_or_equal:today',
                'manager_id' => 'nullable|exists:employees,id',
                'hr_id' => 'nullable|exists:employees,id',
                'finance_id' => 'nullable|exists:employees,id',
                'metadata' => 'nullable|array',
                'attachments' => 'nullable|array'
            ]);

            $newRequest = Request::create($validated);
            $newRequest->load(['employee', 'manager', 'hr', 'finance']);

            return response()->json([
                'success' => true,
                'data' => $newRequest,
                'message' => 'Demande créée avec succès'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une demande spécifique
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $request->load(['employee', 'manager', 'hr', 'finance', 'processedBy']);

            return response()->json([
                'success' => true,
                'data' => $request,
                'message' => 'Demande récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approuver une demande
     */
    public function approve(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        try {
            $validated = $httpRequest->validate([
                'approver_id' => 'required|exists:employees,id',
                'comments' => 'nullable|string'
            ]);

            $success = $request->approve($validated['approver_id'], $validated['comments'] ?? null);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Demande approuvée avec succès'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'approbation'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rejeter une demande
     */
    public function reject(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        try {
            $validated = $httpRequest->validate([
                'approver_id' => 'required|exists:employees,id',
                'reason' => 'required|string'
            ]);

            $success = $request->reject($validated['approver_id'], $validated['reason']);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Demande rejetée avec succès'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors du rejet'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des demandes
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Request::count(),
                'by_status' => [
                    'pending' => Request::where('status', 'pending')->count(),
                    'approved' => Request::where('status', 'approved')->count(),
                    'rejected' => Request::where('status', 'rejected')->count(),
                ],
                'by_type' => [
                    'leave' => Request::where('type', 'leave')->count(),
                    'expense' => Request::where('type', 'expense')->count(),
                    'document' => Request::where('type', 'document')->count(),
                    'other' => Request::where('type', 'other')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}