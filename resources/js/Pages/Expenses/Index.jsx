import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Index({ expenses, isAccountant }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        amount: '',
        description: '',
    });

    // 1. คำนวณข้อมูลสถิติสำหรับกราฟ
    const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount), 0);
    const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + Number(e.amount), 0);
    const rejectedAmount = expenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + Number(e.amount), 0);

    // ข้อมูลสำหรับ Doughnut Chart (สัดส่วนสถานะ)
    const donutData = {
        labels: ['รออนุมัติ (Pending)', 'อนุมัติแล้ว (Approved)', 'ปฏิเสธ (Rejected)'],
        datasets: [
            {
                data: [pendingAmount, approvedAmount, rejectedAmount],
                backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
                borderWidth: 1,
            },
        ],
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/expenses', { onSuccess: () => reset() });
    };

    const handleStatusUpdate = (id, status) => {
        router.patch(`/expenses/${id}/status`, { status });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* หัวข้อ + ปุ่ม ดาวน์โหลด PDF */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">ระบบบริหารการเบิกจ่ายค่าใช้จ่าย</h1>
                <a
                    href="/expenses/export-pdf"
                    target="_blank"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center space-x-2 shadow"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                    </svg>
                    <span>ดาวน์โหลดรายงาน PDF</span>
                </a>
            </div>

            {/* ส่วนที่เพิ่มใหม่: กราฟและกล่องสรุปผล */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* กล่องสรุปตัวเลข */}
                <div className="space-y-4 md:col-span-1">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                        <p className="text-sm font-medium text-gray-500">ยอดอนุมัติแล้วทั้งหมด</p>
                        <p className="text-2xl font-bold text-emerald-600">฿{approvedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
                        <p className="text-sm font-medium text-gray-500">ยอดรอการอนุมัติ</p>
                        <p className="text-2xl font-bold text-amber-600">฿{pendingAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
                        <p className="text-sm font-medium text-gray-500">ยอดที่ถูกปฏิเสธ</p>
                        <p className="text-2xl font-bold text-rose-600">฿{rejectedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* แสดงกราฟสัดส่วน */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm md:col-span-2 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">สัดส่วนยอดเงินค่าใช้จ่ายแบ่งตามสถานะ</h3>
                    <div className="w-full max-w-xs">
                        <Doughnut data={donutData} />
                    </div>
                </div>
            </div>

            {/* ฟอร์มบันทึกค่าใช้จ่าย (ส่วนเดิม) */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">บันทึกขอเบิกค่าใช้จ่าย</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">รายการค่าใช้จ่าย</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="เช่น ค่าเดินทางไปพบลูกค้า"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">จำนวนเงิน (บาท)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">รายละเอียดเพิ่มเติม</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows="2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg transition"
                    >
                        ยื่นขอเบิกเงิน
                    </button>
                </form>
            </div>

            {/* ตารางรายการเบิกจ่าย (ส่วนเดิม) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-700">รายการขอเบิกจ่ายทั้งหมด</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="p-4">ผู้ขอเบิก</th>
                                <th className="p-4">รายการ</th>
                                <th className="p-4">จำนวนเงิน</th>
                                <th className="p-4">สถานะ</th>
                                {isAccountant && <th className="p-4 text-center">จัดการ (ฝ่ายบัญชี)</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{expense.user?.name || 'ไม่ระบุชื่อ'}</td>
                                    <td className="p-4">
                                        <p className="font-semibold">{expense.title}</p>
                                        <p className="text-xs text-gray-400">{expense.description}</p>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800">
                                        ฿{Number(expense.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                                            expense.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                                            expense.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                                            'bg-yellow-100 text-yellow-800 border-yellow-300'
                                        }`}>
                                            {expense.status.toUpperCase()}
                                        </span>
                                    </td>
                                    {isAccountant && (
                                        <td className="p-4 text-center space-x-2">
                                            {expense.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(expense.id, 'approved')}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                                                    >
                                                        อนุมัติ
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(expense.id, 'rejected')}
                                                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                                                    >
                                                        ปฏิเสธ
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}