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
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->enum('absence_type', ['justified', 'unjustified', 'authorized']);
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time')->nullable(); // Pour absences partielles
            $table->time('end_time')->nullable(); // Pour absences partielles
            $table->decimal('duration_hours', 5, 2)->default(8); // Durée en heures
            $table->timestamp('declared_at')->nullable(); // Déclaration avant 9h
            $table->boolean('declared_on_time')->default(false); // Déclaré dans les temps
            $table->boolean('justification_provided')->default(false);
            $table->boolean('medical_certificate_required')->default(false);
            $table->boolean('medical_certificate_provided')->default(false);
            $table->string('justification_file_path')->nullable(); // Chemin du fichier
            $table->text('reason')->nullable(); // Raison de l'absence
            $table->text('manager_notes')->nullable(); // Notes du manager
            $table->decimal('salary_deduction', 10, 2)->default(0); // Retenue sur salaire
            $table->boolean('disciplinary_action')->default(false); // Action disciplinaire
            $table->enum('status', ['pending_review', 'validated', 'rejected'])->default('pending_review');
            $table->unsignedBigInteger('validated_by')->nullable(); // Qui a validé
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('validated_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['employee_id', 'start_date']);
            $table->index(['absence_type', 'status']);
            $table->index('declared_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
