import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
import { PaymentMethodEnum } from 'src/utils/enum/PaymentMethodEnum';
import DialogOrderDetails from './DialogOrderDetails';
import DialogChangeStatus from './DialogChangeStatus';
import Label from 'src/components/Label';
import { useState } from 'react';
import { formatCurrency } from 'src/utils/formatCurrency';

interface TableListOrderProps {
  listOrder: any[];
  labelTable: any[];
  handleChangeStatusOrder: (id: number, status: number) => void;
}

function TableListOrder({
  listOrder,
  labelTable,
  handleChangeStatusOrder
}: TableListOrderProps) {
  const theme = useTheme();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStatusChange, setOpenStatusChange] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<number>(0);

  const handleOpenDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedOrderId(null);
  };

  const handleOpenStatusChange = (orderId: number, currentStatus: number) => {
    setSelectedOrderId(orderId);
    setSelectedOrderStatus(currentStatus);
    setOpenStatusChange(true);
  };

  const handleCloseStatusChange = () => {
    setOpenStatusChange(false);
    setSelectedOrderId(null);
    setSelectedOrderStatus(0);
  };

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
        return 'Đang chuẩn bị hàng';
      case StatusOrderEnum.SHIPPED:
        return 'Đang giao hàng';
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
      case PaymentStatusEnum.CANCELLED:
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
      case PaymentStatusEnum.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentMethodText = (method: number) => {
    switch (method) {
      case PaymentMethodEnum.COD:
        return 'Thanh toán khi nhận hàng (COD)';
      case PaymentMethodEnum.VNPAY:
        return 'Thanh toán VNPAY';
      case PaymentMethodEnum.STORE:
        return 'Thanh toán tại cửa hàng';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentMethodIcon = (method: number) => {
    switch (method) {
      case PaymentMethodEnum.COD:
        return <PaymentIcon fontSize="small" />;
      case PaymentMethodEnum.VNPAY:
        return <PaymentIcon fontSize="small" />;
      case PaymentMethodEnum.STORE:
        return <ShippingIcon fontSize="small" />;
      default:
        return <PaymentIcon fontSize="small" />;
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mx: 2, my: 1, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Tổng tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thanh toán</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Thanh toán</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listOrder &&
              listOrder.map((item: any) => {
                return (
                  <TableRow 
                    hover 
                    key={item.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        #{item.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 30, 
                            height: 30,
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                            mr: 1
                          }}
                        >
                          {item.user_id}
                        </Avatar>
                        <Typography variant="body2">
                          Khách hàng {item.user_id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatCurrency(item.total_price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPaymentMethodIcon(item.payment_method)}
                        label={getPaymentMethodText(item.payment_method)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.created_at}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Label color={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <Label color={getPaymentStatusColor(item.payment_status)}>
                        {getPaymentStatusText(item.payment_status)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenDetails(item.id)}
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': { backgroundColor: theme.palette.primary.light }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Thay đổi trạng thái">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenStatusChange(item.id, item.status)}
                            sx={{ 
                              color: theme.palette.warning.main,
                              '&:hover': { backgroundColor: theme.palette.warning.light }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogOrderDetails
        open={openDetails}
        onClose={handleCloseDetails}
        orderId={selectedOrderId || 0}
      />

      <DialogChangeStatus
        open={openStatusChange}
        onClose={handleCloseStatusChange}
        orderId={selectedOrderId || 0}
        currentStatus={selectedOrderStatus}
        handleChangeStatusOrder={handleChangeStatusOrder}
      />
    </>
  );
}

export default TableListOrder; 