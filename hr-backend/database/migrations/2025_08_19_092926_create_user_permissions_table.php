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
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('permission_id');
            $table->boolean('granted')->default(true); // Permission accordée ou révoquée
            $table->unsignedBigInteger('granted_by')->nullable(); // Qui a accordé la permission
            $table->text('reason')->nullable(); // Raison de l'attribution/révocation
            $table->timestamp('granted_at')->nullable(); // Quand la permission a été accordée
            $table->timestamp('expires_at')->nullable(); // Date d'expiration (optionnel)
            $table->timestamps();

            // Index pour optimiser les performances
            $table->index(['user_id', 'permission_id']);
            $table->index(['user_id', 'granted']);
            $table->index(['permission_id']);
            $table->index(['granted_by']);
            $table->index(['expires_at']);

            // Contrainte d'unicité pour éviter les doublons
            $table->unique(['user_id', 'permission_id'], 'unique_user_permission');

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            $table->foreign('granted_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};