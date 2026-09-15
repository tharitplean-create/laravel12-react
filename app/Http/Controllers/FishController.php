<?php

namespace App\Http\Controllers;

use App\Models\Fish;
use Inertia\Inertia;

class FishController extends Controller
{
    // แสดงหน้าเว็บ React ผ่าน Inertia
    public function index()
    {
        return Inertia::render('Quiz4');
    }

    // API สำหรับดึงข้อมูลปลา (JSON)
    public function getFishesApi()
    {
        $fishes = Fish::all();
        return response()->json($fishes);
    }
}