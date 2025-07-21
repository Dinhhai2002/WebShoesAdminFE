import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { useState } from 'react';
import { ReturnStatus, getReturnStatusLabel } from 'src/constants/ReturnRequestConstants';

interface DialogChangeStatusProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (status: string, notes?: string, priceDifference?: number) => void;
  currentStatus?: string;
  title?: string;
}

const DialogChangeStatus = ({
  open,
  onClose,
  onConfirm,
  currentStatus,
  title = 'Thay đổi trạng thái'
}: DialogChangeStatusProps) => {
  const [status, setStatus] = useState<string>(currentStatus || ReturnStatus.PENDING);
  const [notes, setNotes] = useState<string>('');
  const [priceDifference, setPriceDifference] = useState<number>(0);
  const handleConfirm = () => {
    onConfirm(status, notes, priceDifference);
    onClose();
    setNotes('');
  };

  const statusOptions = [
    { value: ReturnStatus.PENDING, label: 'Chờ duyệt' },
    { value: ReturnStatus.APPROVED, label: 'Đã duyệt' },
    { value: ReturnStatus.REJECTED, label: 'Từ chối' },
    { value: ReturnStatus.PROCESSING, label: 'Đang xử lý' },
    { value: ReturnStatus.COMPLETED, label: 'Hoàn thành' },
    { value: ReturnStatus.CANCELLED, label: 'Đã hủy' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              label="Trạng thái"
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (tùy chọn)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú nếu cần..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogChangeStatus; 