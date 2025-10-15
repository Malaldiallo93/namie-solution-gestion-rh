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
        Schema::create('leave_periods', function (Blueprint $table) {
            $table->id();
            $table->year('year'); // Année de la période (ex: 2025)
            $table->date('start_date'); // 1er juin de l'année
            $table->date('end_date'); // 31 mai de l'année suivante
            $table->date('summer_period_start'); // 1er juillet
            $table->date('summer_period_end'); // 31 août
            $table->integer('min_summer_days')->default(14); // Minimum 2 semaines en été
            $table->boolean('is_active')->default(true);
            $table->json('company_closures')->nullable(); // Fermetures entreprise
            $table->json('public_holidays')->nullable(); // Jours fériés de la période
            $table->timestamps();

            $table->unique('year');
            $table->index(['start_date', 'end_date']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_periods');
    }
};
