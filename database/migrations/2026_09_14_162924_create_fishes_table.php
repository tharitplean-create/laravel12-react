<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fishes', function (Blueprint $table) {
            $table->id();
            $table->string('name');                 // 1. ชื่อปลา
            $table->string('scientific_name');      // 2. ชื่อวิทยาศาสตร์
            $table->string('water_type');           // 3. ประเภทน้ำ (น้ำจืด/น้ำเค็ม/น้ำกร่อย)
            $table->decimal('avg_size_cm', 8, 2);   // 4. ขนาดเฉลี่ย (ซม.)
            $table->integer('lifespan_years');      // 5. อายุขัยเฉลี่ย (ปี)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fishes');
    }
};
