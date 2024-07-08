<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn',17)->nullable(false)->unique();
            $table->string('key_title',255)->nullable(false);
            $table->string('publisher',50)->nullable(false);
            $table->string('language',2)->nullable(false);
            $table->string('author',50)->nullable(false);
            $table->string('key_description',255)->nullable(false);
            $table->double('price');
            $table->text('image')->nullable();
            $table->decimal('average_rating', 2, 1)->default(0); // Promedio de valoraciones
            $table->unsignedInteger('rating_count')->default(0); // Contador de valoraciones
            $table->unsignedInteger('comments_count')->default(0); // Contador de comentarios
            $table->foreignId('subcategory_id')->constrained('subcategories');
            $table->timestamps();
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
