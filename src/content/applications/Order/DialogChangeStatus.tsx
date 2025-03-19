import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
  Zoom,
  Typography,
  Box
} from '@mui/material';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { useState } from 'react';
import Label from 'src/components/Label';

interface DialogChangeStatusProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  currentStatus: number;
  handleChangeStatusOrder: (id: number, status: number) => void;
}

function DialogChangeStatus({
  open,
  onClose,
  orderId,
  currentStatus,
  handleChangeStatusOrder
}: DialogChangeStatusProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedStatus, setSelectedStatus] = useState<number>(currentStatus);

  const handleChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmit = () => {
    handleChangeStatusOrder(orderId, selectedStatus);
    onClose();
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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Zoom}
      transitionDuration={600}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="responsive-dialog-title">
        Thay đổi trạng thái đơn hàng #{orderId}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Trạng thái hiện tại:
          </Typography>
          <Label color={getStatusColor(currentStatus)}>
            {getStatusText(currentStatus)}
          </Label>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Chọn trạng thái mới</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={selectedStatus}
            label="Chọn trạng thái mới"
            onChange={handleChange}
          >
            <MenuItem value={StatusOrderEnum.PENDING}>Chờ xác nhận</MenuItem>
            <MenuItem value={StatusOrderEnum.CONFIRMED}>Đã xác nhận</MenuItem>
            <MenuItem value={StatusOrderEnum.PROCESSING}>Đang xử lý</MenuItem>
            <MenuItem value={StatusOrderEnum.SHIPPED}>Đã gửi hàng</MenuItem>
            <MenuItem value={StatusOrderEnum.DELIVERED}>Đã giao hàng</MenuItem>
            <MenuItem value={StatusOrderEnum.CANCELLED}>Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogChangeStatus; 