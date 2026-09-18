<!DOCTYPE html>
<html lang="th">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>รายงานสรุปการเบิกจ่ายค่าใช้จ่าย</title>
    <style>
        @font-face {
            font-family: 'Sarabun';
            font-style: normal;
            font-weight: normal;
            src: url("{{ public_path('fonts/Sarabun-Regular.ttf') }}") format('truetype');
        }
        @font-face {
            font-family: 'Sarabun';
            font-style: normal;
            font-weight: bold;
            src: url("{{ public_path('fonts/Sarabun-Bold.ttf') }}") format('truetype');
        }

        body {
            font-family: 'Sarabun', sans-serif;
            font-size: 16px;
        }


        h1 { text-align: center; font-size: 24px; margin-bottom: 5px; }
        .meta { text-align: right; font-size: 14px; color: #666; margin-bottom: 20px; }
        .summary-box { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .summary-box td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.data th, table.data td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        table.data th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .status-approved { color: green; font-weight: bold; }
        .status-pending { color: orange; font-weight: bold; }
        .status-rejected { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <h1>รายงานสรุปการขอเบิกจ่ายค่าใช้จ่าย</h1>
    <div class="meta">
        ผู้ส่งออกรายงาน: {{ $user->name }} | วันที่ออกรายงาน: {{ $exportDate }}
    </div>

    <table class="summary-box">
        <tr>
            <td style="background-color: #e6fffa;">
                <strong>ยอดอนุมัติแล้วทั้งหมด</strong><br>
                <span style="font-size: 16px; color: #047857;">฿{{ number_format($totalApproved, 2) }}</span>
            </td>
            <td style="background-color: #cef56b;">
                <strong>ยอดรอการอนุมัติ</strong><br>
                <span style="font-size: 16px; color: #b45309;">฿{{ number_format($totalPending, 2) }}</span>
            </td>
        </tr>
    </table>

    <h3>รายการขอเบิกจ่าย</h3>
    <table class="data">
        <thead>
            <tr>
                <th>#</th>
                <th>ผู้ขอเบิก</th>
                <th>รายการ</th>
                <th class="text-right">จำนวนเงิน (บาท)</th>
                <th>สถานะ</th>
            </tr>
        </thead>
        <tbody>
            @foreach($expenses as $index => $expense)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $expense->user->name }}</td>
                <td>{{ $expense->title }}</td>
                <td class="text-right">{{ number_format($expense->amount, 2) }}</td>
                <td class="status-{{ $expense->status }}">
                    {{ strtoupper($expense->status) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>