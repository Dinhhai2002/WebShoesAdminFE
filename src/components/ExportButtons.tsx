import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from 'src/services/API/OrderApi';
import { formatCurrency } from 'src/utils/formatCurrency';

interface ExportButtonsProps {
  order: Order;
}

function ExportButtons({ order }: ExportButtonsProps) {
  const handleExportExcel = () => {
    const data = order.order_detail.map((item) => ({
      'Mã SP': item.product_detail.product_id,
      'Tên SP': item.product_detail.name,
      'Màu sắc': item.product_detail.color,
      'Size': item.product_detail.size,
      'Số lượng': item.quantity,
      'Đơn giá': formatCurrency(item.price),
      'Thành tiền': formatCurrency(item.total_price)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ChiTietDonHang');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Order_${order.id}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY?: number } };

    doc.setFontSize(16);
    doc.text(`Chi tiết đơn hàng #${order.id}`, 14, 14);

    const rows = order.order_detail.map((item) => [
      item.product_detail.product_id,
      item.product_detail.name,
      item.product_detail.color,
      item.product_detail.size,
      item.quantity.toString(),
      formatCurrency(item.price),
      formatCurrency(item.total_price)
    ]);

    autoTable(doc, {
      head: [[
        'Mã SP', 'Tên SP', 'Màu sắc', 'Size', 'Số lượng', 'Đơn giá', 'Thành tiền'
      ]],
      body: rows,
      startY: 20
    });

    const finalY = doc.lastAutoTable?.finalY || 30;
    doc.setFontSize(12);
    doc.text(`Tổng cộng: ${formatCurrency(order.total_price)}`, 14, finalY + 10);

    doc.save(`Order_${order.id}.pdf`);
  };

  return (
    <>
      <Button onClick={handleExportExcel} variant="outlined" sx={{ mr: 1 }}>
        Xuất Excel
      </Button>
      <Button onClick={handleExportPDF} variant="outlined" color="secondary">
        Xuất PDF
      </Button>
    </>
  );
}

export default ExportButtons;
