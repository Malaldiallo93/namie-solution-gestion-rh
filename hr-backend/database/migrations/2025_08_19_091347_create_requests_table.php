<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique(); // Numéro de demande unique
            $table->unsignedBigInteger('employee_id'); // Demandeur
            $table->enum('type', [
                'leave',           // Demande de congé
                'expense',         // Note de frais
                'document',        // Demande de document
                'equipment',       // Demande d'équipement
                'training',        // Demande de formation
                'overtime',        // Demande d'heures supplémentaires
                'advance',         // Avance sur salaire
                'other'           // Autre type de demande
            ]);
            $table->string('title'); // Titre de la demande
            $table->text('description'); // Description détaillée
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', [
                'pending',         // En attente
                'under_review',    // En cours d'examen
                'approved',        // Approuvée
                'rejected',        // Rejetée
                'cancelled',       // Annulée
                'completed'        // Terminée
            ])->default('pending');
            
            // Montants pour les demandes financières
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('currency', 3)->default('EUR');
            
            // Dates
            $table->date('requested_date')->nullable(); // Date demandée (pour congés, formations, etc.)
            $table->date('end_date')->nullable(); // Date de fin (pour congés, formations, etc.)
            $table->date('due_date')->nullable(); // Date limite de traitement
            
            // Workflow d'approbation
            $table->unsignedBigInteger('manager_id')->nullable(); // Manager direct
            $table->timestamp('manager_approved_at')->nullable();
            $table->text('manager_comments')->nullable();
            $table->unsignedBigInteger('hr_id')->nullable(); // RH
            $table->timestamp('hr_approved_at')->nullable();
            $table->text('hr_comments')->nullable();
            $table->unsignedBigInteger('finance_id')->nullable(); // Finance (pour demandes financières)
            $table->timestamp('finance_approved_at')->nullable();
            $table->text('finance_comments')->nullable();
            
            // Métadonnées et pièces jointes
            $table->json('metadata')->nullable(); // Données spécifiques au type de demande
            $table->json('attachments')->nullable(); // Liste des fichiers joints
            
            // Traçabilité
            $table->unsignedBigInteger('processed_by')->nullable(); // Qui a traité la demande
            $table->timestamp('processed_at')->nullable();
            $table->text('processing_notes')->nullable();
            
            $table->timestamps();
            
            // Index pour optimiser les performances
            $table->index(['employee_id']);
            $table->index(['type']);
            $table->index(['status']);
            $table->index(['priority']);
            $table->index(['manager_id']);
            $table->index(['hr_id']);
            $table->index(['finance_id']);
            $table->index(['created_at']);
            
            // Foreign keys
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('manager_id')->references('id')->on('employees')->onDelete('set null');
            $table->foreign('hr_id')->references('id')->on('employees')->onDelete('set null');
            $table->foreign('finance_id')->references('id')->on('employees')->onDelete('set null');
            $table->foreign('processed_by')->references('id')->on('employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};