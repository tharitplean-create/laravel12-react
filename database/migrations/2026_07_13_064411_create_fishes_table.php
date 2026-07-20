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
        Schema::create('fishes', function (Blueprint $table) {
            $table->id();
            $table->string('name');                 // 1. ชื่อปลา (ภาษาไทย/ทั่วไป)
            $table->string('scientific_name');      // 2. ชื่อวิทยาศาสตร์
            $table->string('habitat');              // 3. แหล่งที่อยู่อาศัย (เช่น น้ำจืด, น้ำเค็ม)
            $table->decimal('max_length_cm', 6, 2); // 4. ความยาวสูงสุด (เซนติเมตร)
            $table->string('diet');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fishes');
    }
};
