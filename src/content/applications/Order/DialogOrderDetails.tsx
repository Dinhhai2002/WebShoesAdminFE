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
  Zoom,
  Chip,
  SvgIcon
} from '@mui/material';
import { Save } from '@mui/icons-material';
import {
  useEffect,
  useState
} from 'react';
import { Order } from 'src/services/API/OrderApi';
import orderApi from 'src/services/API/OrderApi';
import Label from 'src/components/Label';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
import { formatCurrency } from 'src/utils/formatCurrency';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { PaymentMethodEnum } from 'src/utils/enum/PaymentMethodEnum';

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

  const fetchOrderDetail = async () => {
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

  useEffect(() => {
    fetchOrderDetail();
  }, [open, orderId]);

  const getStatusLabel = (status: number, paymentMethod: number) => {
    const statusMap = {
      [StatusOrderEnum.PENDING]: { text: 'Chờ xác nhận', color: 'warning' },
      [StatusOrderEnum.CONFIRMED]: { text: 'Đã xác nhận', color: 'success' },
      [StatusOrderEnum.PROCESSING]: { text: 'Đang chuẩn bị hàng', color: 'info' },
      [StatusOrderEnum.SHIPPED]: { text: 'Đã gửi hàng', color: 'primary' },
      [StatusOrderEnum.DELIVERED]: { text: paymentMethod === 3 ? 'Thành công' : 'Đã giao hàng', color: 'success' },
      [StatusOrderEnum.CANCELLED]: { text: 'Đã hủy', color: 'error' },
    };

    const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
    return <Label color={statusInfo.color}>{statusInfo.text}</Label>;
  };

  const getPaymentStatusLabel = (status: PaymentStatusEnum) => {
    const statusMap = {
      [PaymentStatusEnum.PENDING]: { text: 'Chờ thanh toán', color: 'warning' },
      [PaymentStatusEnum.PROCESSING]: { text: 'Đang xử lý', color: 'info' },
      [PaymentStatusEnum.PAID]: { text: 'Đã thanh toán', color: 'success' },
      [PaymentStatusEnum.FAILED]: { text: 'Thất bại', color: 'error' },
    };

    const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
    return <Label color={statusInfo.color}>{statusInfo.text}</Label>;
  };

  const getPaymentMethodLabel = (method: number) => {
    const methodMap = {
      1: 'Thanh toán khi nhận hàng',
      2: 'Thanh toán online',
      3: 'Thanh toán tại quầy',
    };

    return methodMap[method] || 'Không xác định';
  };

  const handleExportExcel = async () => {
    const data = order?.order_detail.map((item) => ({
      'Product ID': item.product_detail.product_id,
      'Product Name': item.product_detail.name,
      'Color': item.product_detail.color,
      'Size': item.product_detail.size,
      'Quantity': item.quantity,
      'Unit Price': formatCurrency(item.price),
      'Total Price': formatCurrency(item.total_price)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OrderDetails');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Order_${order?.id}.xlsx`);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY?: number } };

    doc.setFontSize(16);
    doc.text(`Order Details #${order?.id}`, 14, 14);

    const rows = order?.order_detail.map((item) => [
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
        'Product ID', 'Product Name', 'Color', 'Size', 'Quantity', 'Unit Price', 'Total Price'
      ]],
      body: rows,
      startY: 20
    });

    const finalY = doc.lastAutoTable?.finalY || 30;
    doc.setFontSize(12);
    doc.text(`Grand Total: ${formatCurrency(order?.total_price)}`, 14, finalY + 10);

    doc.save(`Order_${order?.id}.pdf`);
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
        <DialogTitle>Đang tải...</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      TransitionComponent={Zoom}
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '1200px',
          margin: '20px auto'
        }
      }}
    >
      <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Order Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin đơn hàng
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1" gutterBottom>
                Mã đơn hàng: #{order.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ngày đặt: {order.created_at}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phương thức thanh toán: {getPaymentMethodLabel(order.payment_method)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Trạng thái thanh toán: {getPaymentStatusLabel(order.payment_status)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Trạng thái đơn hàng: {getStatusLabel(order.status, order.payment_method)}
              </Typography>
            </Box>
          </Grid>
          {order.voucher && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thông tin voucher
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Mã voucher: {order.voucher.code}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Loại giảm giá: {order.voucher.discount_type === 1 ? 'Phần trăm' : 'Giảm trực tiếp'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Giá trị giảm: {order.voucher.discount_type === 1 ?
                    `${order.voucher.discount_value}%` :
                    formatCurrency(order.voucher.discount_value)}
                </Typography>
                {/* <Typography variant="body1" gutterBottom>
                  Hạn sử dụng: {order.voucher.start_date} - {order.voucher.end_date}
                </Typography> */}
              </Box>
            </Grid>
          )}
          {/* Shipping Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {order.payment_method === 3 ? "Địa chỉ cửa hàng" : "Địa chỉ giao hàng"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                  {order.payment_method === 3 ? "Nhân viên" : "Người nhận"}
                  </Typography>
                  <Typography>{order.shipping_name}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Địa chỉ
                  </Typography>
                  <Typography>
                    {order.shipping_address}, {order.shipping_ward_name}, {order.shipping_district_name}, {order.shipping_city_name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                   {order.payment_method === PaymentMethodEnum.STORE ? "Số điện thoại khách hàng" : "Số điện thoại người nhận"}
                  </Typography>
                  <Typography>{order.payment_method === PaymentMethodEnum.STORE ? order.customer_phone : order.shipping_phone}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Thông tin</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.order_detail.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img
                            src={detail.product_detail.image_url}
                            alt={detail.product_detail.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2">{detail.product_detail.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {detail.product_detail.color} - {detail.product_detail.size}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(detail.price)}</TableCell>
                      <TableCell align="right">{detail.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(detail.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    Tổng tiền hàng:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(order.price)}
                  </Typography>
                </Grid>
                {order.discount_amount > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        Giảm giá:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right" color="error">
                        -{formatCurrency(order.discount_amount)}
                      </Typography>
                    </Grid>
                  </>
                )}
                {order.amount_shipping > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        Phí vận chuyển:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right" color="primary">
                        +{formatCurrency(order.amount_shipping)}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Divider sx={{ my: 1, width: '100%' }} />
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    Tổng cộng:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    {formatCurrency(order.total_price)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleExportExcel} variant="outlined" startIcon={<Save />}>Export Excel</Button> */}
        <Button onClick={handleExportPDF} variant="outlined" startIcon={<Save />}>Export PDF</Button>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogOrderDetails;
