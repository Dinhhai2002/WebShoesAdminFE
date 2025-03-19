import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Box
} from '@mui/material';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
import Label from 'src/components/Label';
import { useEffect, useState } from 'react';
import orderApi from 'src/services/API/OrderApi';
import { Order } from 'src/services/API/OrderApi';
import { formatCurrency } from 'src/utils/formatCurrency';

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
      case StatusOrderEnum.PENDING:
        return 'warning';
      case StatusOrderEnum.CONFIRMED:
        return 'success';
      case StatusOrderEnum.PROCESSING:
        return 'info';
      case StatusOrderEnum.SHIPPED:
        return 'primary';
      case StatusOrderEnum.DELIVERED:
        return 'success';
      case StatusOrderEnum.CANCELLED:
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case StatusOrderEnum.PENDING:
        return 'Chờ xác nhận';
      case StatusOrderEnum.CONFIRMED:
        return 'Đã xác nhận';
      case StatusOrderEnum.PROCESSING:
        return 'Đang xử lý';
      case StatusOrderEnum.SHIPPED:
        return 'Đã gửi hàng';
      case StatusOrderEnum.DELIVERED:
        return 'Đã giao hàng';
      case StatusOrderEnum.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case PaymentStatusEnum.PENDING:
        return 'warning';
      case PaymentStatusEnum.PROCESSING:
        return 'info';
      case PaymentStatusEnum.PAID:
        return 'success';
      case PaymentStatusEnum.FAILED:
        return 'error';
      default:
        return 'info';
    }
  };

  const getPaymentStatusText = (status: number) => {
    switch (status) {
      case PaymentStatusEnum.PENDING:
        return 'Chưa thanh toán';
      case PaymentStatusEnum.PROCESSING:
        return 'Đang chờ thanh toán';
      case PaymentStatusEnum.PAID:
        return 'Đã thanh toán';
      case PaymentStatusEnum.FAILED:
        return 'Thanh toán thất bại';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Zoom}
        transitionDuration={600}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Zoom}
      transitionDuration={600}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="responsive-dialog-title">
        Chi tiết đơn hàng #{order?.id}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Mã đơn hàng
            </Typography>
            <Typography variant="body1">{order?.id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Mã người dùng
            </Typography>
            <Typography variant="body1">{order?.user_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tổng tiền
            </Typography>
            <Typography variant="body1">{formatCurrency(order?.total_price || 0)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phương thức thanh toán
            </Typography>
            <Typography variant="body1">{order?.payment_method}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày tạo
            </Typography>
            <Typography variant="body1">{order?.created_at}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Trạng thái đơn hàng
            </Typography>
            <Label color={getStatusColor(order?.status)}>
              {getStatusText(order?.status)}
            </Label>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Trạng thái thanh toán
            </Typography>
            <Label color={getPaymentStatusColor(order?.payment_status)}>
              {getPaymentStatusText(order?.payment_status)}
            </Label>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Danh sách sản phẩm
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Hình ảnh</TableCell>
                <TableCell align="center">Mã sản phẩm</TableCell>
                <TableCell align="center">Tên sản phẩm</TableCell>
                <TableCell align="center">Màu sắc</TableCell>
                <TableCell align="center">Kích thước</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="center">Đơn giá</TableCell>
                <TableCell align="center">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order?.order_detail?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">
                    <Box
                      component="img"
                      src={item.product_detail.image_url}
                      alt={item.product_detail.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Tổng cộng:
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(order?.total_price || 0)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogOrderDetails; 