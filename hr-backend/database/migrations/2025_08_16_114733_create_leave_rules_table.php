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
        Schema::create('leave_rules', function (Blueprint $table) {
            $table->id();
            $table->enum('leave_type', ['annual', 'sick', 'maternity', 'paternity', 'unpaid', 'rtt', 'exceptional']);
            $table->string('rule_name'); // Nom de la règle
            $table->text('description'); // Description de la règle
            $table->integer('max_consecutive_days')->nullable(); // Max jours consécutifs (4 semaines = 28 jours pour annual)
            $table->integer('advance_notice_days'); // Préavis requis (15 jours ou 1 mois)
            $table->boolean('requires_hr_approval')->default(false); // > 10 jours consécutifs
            $table->boolean('requires_manager_approval')->default(true);
            $table->integer('max_per_year')->nullable(); // Limite annuelle
            $table->json('seasonal_restrictions')->nullable(); // Restrictions été obligatoires
            $table->json('blackout_periods')->nullable(); // Périodes interdites
            $table->boolean('requires_medical_certificate')->default(false);
            $table->integer('medical_certificate_after_days')->nullable(); // Certificat à partir de X jours
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['leave_type', 'rule_name']);
            $table->index('leave_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_rules');
    }
};
