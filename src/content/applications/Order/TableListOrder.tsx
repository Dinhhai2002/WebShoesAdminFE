import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Button
} from '@mui/material';
import TableCellComponent from 'src/components/TableCellComponent/TableCellComponent';
import IconActions from 'src/components/IconActions/IconActions';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
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

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {labelTable.map((item: any) => (
                <TableCell align="center" key={item.id}>
                  {item.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listOrder &&
              listOrder.map((item: any) => {
                return (
                  <TableRow hover key={item.id}>
                    <TableCellComponent position={'center'} value={item.id} />
                    <TableCellComponent position={'center'} value={item.user_id} />
                    <TableCellComponent position={'center'} value={formatCurrency(item.total_price)} />
                    <TableCellComponent position={'center'} value={item.payment_method} />
                    <TableCellComponent position={'center'} value={item.created_at} />

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
                      <Button
                        onClick={() => handleOpenDetails(item.id)}
                        sx={{ textTransform: 'none', minWidth: 'auto', mr: 1 }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        onClick={() => handleOpenStatusChange(item.id, item.status)}
                        sx={{ textTransform: 'none', minWidth: 'auto' }}
                      >
                        Thay đổi trạng thái
                      </Button>
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