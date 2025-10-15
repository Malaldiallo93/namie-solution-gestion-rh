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
        Schema::table('departments', function (Blueprint $table) {
            $table->string('department_type')->nullable()->after('description');
            $table->integer('target_headcount')->nullable()->after('budget');
            $table->text('objectives')->nullable()->after('target_headcount');
            $table->string('key_skills')->nullable()->after('objectives');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['department_type', 'target_headcount', 'objectives', 'key_skills']);
        });
    }
};