import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Order } from 'src/services/API/OrderApi';
import orderApi from 'src/services/API/OrderApi';
import Label from 'src/components/Label';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
import { formatCurrency } from 'src/utils/formatCurrency';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DialogOrderDetailsProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

function DialogOrderDetails({ open, onClose, orderId }: DialogOrderDetailsProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (open && orderId) {
        setLoading(true);
        try {
          const response = await orderApi.findOne(orderId);
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [open, orderId]);

  const getStatusColor = (status: number) => {
    switch (status) {
      case StatusOrderEnum.PENDING: return 'warning';
      case StatusOrderEnum.CONFIRMED: return 'success';
      case StatusOrderEnum.PROCESSING: return 'info';
      case StatusOrderEnum.SHIPPED: return 'primary';
      case StatusOrderEnum.DELIVERED: return 'success';
      case StatusOrderEnum.CANCELLED: return 'error';
      default: return 'info';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case StatusOrderEnum.PENDING: return 'Chờ xác nhận';
      case StatusOrderEnum.CONFIRMED: return 'Đã xác nhận';
      case StatusOrderEnum.PROCESSING: return 'Đang xử lý';
      case StatusOrderEnum.SHIPPED: return 'Đã gửi hàng';
      case StatusOrderEnum.DELIVERED: return 'Đã giao hàng';
      case StatusOrderEnum.CANCELLED: return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getPaymentStatusText = (status: number) => {
    switch (status) {
      case PaymentStatusEnum.PENDING: return 'Chưa thanh toán';
      case PaymentStatusEnum.PROCESSING: return 'Đang chờ thanh toán';
      case PaymentStatusEnum.PAID: return 'Đã thanh toán';
      case PaymentStatusEnum.FAILED: return 'Thanh toán thất bại';
      default: return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case PaymentStatusEnum.PENDING: return 'warning';
      case PaymentStatusEnum.PROCESSING: return 'info';
      case PaymentStatusEnum.PAID: return 'success';
      case PaymentStatusEnum.FAILED: return 'error';
      default: return 'info';
    }
  };

  const getPaymentMethodText = (method: number) => {
    switch (method) {
      case 1: return 'Thanh toán khi nhận hàng (COD)';
      case 2: return 'Thanh toán qua VNPAY';
      case 3: return 'Thanh toán tại quầy (Store)';
      default: return 'Không xác định';
    }
  };

  const handleExportExcel = () => {
    if (!order) return;

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
    if (!order) return;

    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY?: number } };

    doc.text(`Chi tiết đơn hàng #${order.id}`, 14, 14);

    const rows = order.order_detail.map((item) => [
      item.product_detail.product_id,
      item.product_detail.name,
      item.product_detail.color,
      item.product_detail.size,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.total_price)
    ]);

    autoTable(doc, {
      head: [['Mã SP', 'Tên SP', 'Màu sắc', 'Size', 'Số lượng', 'Đơn giá', 'Thành tiền']],
      body: rows,
      startY: 20
    });

    const finalY = doc.lastAutoTable?.finalY || 40;
    doc.text(`Tổng cộng: ${formatCurrency(order.total_price)}`, 14, finalY + 10);
    doc.save(`Order_${order.id}.pdf`);
  };

  if (loading) {
    return (
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose} TransitionComponent={Zoom} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} TransitionComponent={Zoom} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng #{order?.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}><Typography variant="subtitle2">Mã đơn hàng</Typography><Typography>{order?.id}</Typography></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Mã người dùng</Typography><Typography>{order?.user_id}</Typography></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Tổng tiền</Typography><Typography>{formatCurrency(order?.total_price || 0)}</Typography></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Phương thức thanh toán</Typography><Typography>{getPaymentMethodText(order?.payment_method)}</Typography></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Ngày tạo</Typography><Typography>{order?.created_at}</Typography></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Trạng thái đơn hàng</Typography><Label color={getStatusColor(order?.status)}>{getStatusText(order?.status)}</Label></Grid>
          <Grid item xs={6}><Typography variant="subtitle2">Trạng thái thanh toán</Typography><Label color={getPaymentStatusColor(order?.payment_status)}>{getPaymentStatusText(order?.payment_status)}</Label></Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={handleExportExcel}>Xuất Excel</Button>
          <Button variant="outlined" color="secondary" onClick={handleExportPDF}>Xuất PDF</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Hình ảnh</TableCell>
                <TableCell align="center">Mã SP</TableCell>
                <TableCell align="center">Tên SP</TableCell>
                <TableCell align="center">Màu</TableCell>
                <TableCell align="center">Size</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="center">Đơn giá</TableCell>
                <TableCell align="center">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order?.order_detail.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">
                    <Box
                      component="img"
                      src={item.product_detail.image_url}
                      alt={item.product_detail.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell align="center">{item.product_detail.product_id}</TableCell>
                  <TableCell align="center">{item.product_detail.name}</TableCell>
                  <TableCell align="center">{item.product_detail.color}</TableCell>
                  <TableCell align="center">{item.product_detail.size}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="center">{formatCurrency(item.total_price)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Typography fontWeight="bold">Tổng cộng:</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight="bold">{formatCurrency(order?.total_price || 0)}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogOrderDetails;
