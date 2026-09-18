<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // นำเข้า Facade ด้านบนสุดของไฟล์

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // หากเป็นพนักงาน ให้เห็นเฉพาะรายการของตัวเอง / ฝ่ายบัญชีเห็นทั้งหมด
        $expenses = Expense::with('user:id,name')
            ->when(!$user->is_accountant, fn($q) => $q->where('user_id', $user->id))
            ->latest()
            ->get();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'isAccountant' => (bool) $user->is_accountant
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        $request->user()->expenses()->create($validated);

        return redirect()->back();
    }

    public function updateStatus(Request $request, Expense $expense)
    {
        // ตรวจสอบสิทธิ์ว่าผู้ใช้เป็นฝ่ายบัญชีหรือไม่
        if (!$request->user()->is_accountant) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $expense->update($validated);

        return redirect()->back();
    }
    public function exportPdf(Request $request)
    {
        $user = $request->user();

        // ดึงข้อมูลรายการค่าใช้จ่าย
        $expenses = Expense::with('user:id,name')
            ->when(!$user->is_accountant, fn($q) => $q->where('user_id', $user->id))
            ->latest()
            ->get();

        $totalApproved = $expenses->where('status', 'approved')->sum('amount');
        $totalPending = $expenses->where('status', 'pending')->sum('amount');

        // โหลดหน้า Blade view แล้วแปลงเป็น PDF
        $pdf = Pdf::loadView('pdf.expense_report', [
            'expenses' => $expenses,
            'totalApproved' => $totalApproved,
            'totalPending' => $totalPending,
            'user' => $user,
            'exportDate' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('expense-report-' . date('Y-m-d') . '.pdf');
    }
}
