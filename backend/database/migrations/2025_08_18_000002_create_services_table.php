<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agency_id');
            $table->unsignedBigInteger('category_id');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('location')->nullable();
            $table->json('dates')->nullable();
            $table->json('images')->nullable();
            $table->string('status')->default('inactive');
            $table->timestamps();
            $table->foreign('agency_id')->references('id')->on('agencies')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }
    public function down() {
        Schema::dropIfExists('services');
    }
};
