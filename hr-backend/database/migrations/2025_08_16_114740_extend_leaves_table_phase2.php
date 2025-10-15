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
        Schema::table('leaves', function (Blueprint $table) {
            // Workflow avancé
            $table->enum('approval_level', ['manager', 'hr', 'completed'])->default('manager')->after('status');
            $table->unsignedBigInteger('hr_approved_by')->nullable()->after('approved_by');
            $table->timestamp('hr_approved_at')->nullable()->after('approved_at');
            $table->text('hr_comments')->nullable()->after('comments');
            
            // Gestion des règles
            $table->boolean('requires_hr_approval')->default(false)->after('hr_comments');
            $table->integer('advance_notice_days')->nullable()->after('requires_hr_approval');
            $table->boolean('is_summer_period')->default(false)->after('advance_notice_days');
            $table->boolean('is_emergency_leave')->default(false)->after('is_summer_period');
            
            // Calculs et validations
            $table->decimal('deducted_balance', 5, 2)->nullable()->after('days_requested'); // Jours déduits du solde
            $table->json('balance_breakdown')->nullable()->after('deducted_balance'); // Détail déduction
            $table->json('rule_validations')->nullable()->after('balance_breakdown'); // Résultat validations
            
            // Périodes et planification
            $table->year('leave_year')->nullable()->after('rule_validations'); // Année de référence
            $table->boolean('crosses_periods')->default(false)->after('leave_year'); // Enjambe 2 périodes
            $table->integer('working_days')->nullable()->after('crosses_periods'); // Jours ouvrés réels
            
            // Relations
            $table->foreign('hr_approved_by')->references('id')->on('users')->onDelete('set null');
            
            // Index pour performance
            $table->index(['approval_level', 'status']);
            $table->index(['leave_year', 'type']);
            $table->index(['is_summer_period', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaves', function (Blueprint $table) {
            $table->dropForeign(['hr_approved_by']);
            $table->dropIndex(['approval_level', 'status']);
            $table->dropIndex(['leave_year', 'type']);
            $table->dropIndex(['is_summer_period', 'start_date']);
            
            $table->dropColumn([
                'approval_level', 'hr_approved_by', 'hr_approved_at', 'hr_comments',
                'requires_hr_approval', 'advance_notice_days', 'is_summer_period', 'is_emergency_leave',
                'deducted_balance', 'balance_breakdown', 'rule_validations',
                'leave_year', 'crosses_periods', 'working_days'
            ]);
        });
    }
};
