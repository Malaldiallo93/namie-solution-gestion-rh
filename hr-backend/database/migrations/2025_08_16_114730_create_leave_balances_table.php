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
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->enum('leave_type', ['annual', 'sick', 'maternity', 'paternity', 'unpaid', 'rtt', 'exceptional']);
            $table->year('year'); // Période de référence
            $table->integer('allocated_days'); // Jours alloués
            $table->integer('used_days')->default(0); // Jours utilisés
            $table->integer('remaining_days'); // Jours restants
            $table->integer('carried_over_days')->default(0); // Jours reportés (max 5)
            $table->integer('seniority_bonus')->default(0); // Bonus ancienneté
            $table->date('period_start'); // 1er juin
            $table->date('period_end'); // 31 mai année suivante
            $table->json('calculation_details')->nullable(); // Détails du calcul
            $table->timestamp('last_calculated_at')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->unique(['employee_id', 'leave_type', 'year']);
            $table->index(['employee_id', 'year']);
            $table->index('leave_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
