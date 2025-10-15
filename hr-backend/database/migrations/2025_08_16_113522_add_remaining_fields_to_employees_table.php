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
        Schema::table('employees', function (Blueprint $table) {
            // Ajouter les champs manquants seulement
            if (!Schema::hasColumn('employees', 'contract_type')) {
                $table->enum('contract_type', ['CDI', 'CDD', 'stage', 'apprentissage'])->nullable()->after('position');
            }
            if (!Schema::hasColumn('employees', 'secondary_assignments')) {
                $table->json('secondary_assignments')->nullable()->after('contract_type');
            }
            if (!Schema::hasColumn('employees', 'data_history')) {
                $table->json('data_history')->nullable()->after('manager_id');
            }
            if (!Schema::hasColumn('employees', 'last_modified_at')) {
                $table->timestamp('last_modified_at')->nullable()->after('data_history');
            }
            if (!Schema::hasColumn('employees', 'last_modified_by')) {
                $table->unsignedBigInteger('last_modified_by')->nullable()->after('last_modified_at');
                $table->foreign('last_modified_by')->references('id')->on('users')->onDelete('set null');
            }
            
            // Ajouter les index
            if (!Schema::hasIndex('employees', ['employee_number'])) {
                $table->index('employee_number');
            }
            if (!Schema::hasIndex('employees', ['department', 'status'])) {
                $table->index(['department', 'status']);
            }
            if (!Schema::hasIndex('employees', ['hire_date'])) {
                $table->index('hire_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['last_modified_by']);
            $table->dropIndex(['employee_number']);
            $table->dropIndex(['department', 'status']);
            $table->dropIndex(['hire_date']);
            
            $table->dropColumn([
                'contract_type',
                'secondary_assignments',
                'data_history',
                'last_modified_at',
                'last_modified_by'
            ]);
        });
    }
};
