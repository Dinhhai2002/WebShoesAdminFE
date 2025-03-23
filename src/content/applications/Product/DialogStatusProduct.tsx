import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import productApi from 'src/services/API/ProductApi';

interface DialogStatusProductProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusProduct({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusProductProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      handleChangeStatus(id);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 500 }}
      aria-labelledby="responsive-dialog-title"
      aria-describedby="responsive-dialog-description"
    >
      <DialogTitle id="responsive-dialog-title">
        {currentStatus === 1 ? 'Tạm khóa sản phẩm' : 'Kích hoạt sản phẩm'}
      </DialogTitle>
      <DialogContent>
        <p>
          Bạn có chắc chắn muốn{' '}
          {currentStatus === 1 ? 'tạm khóa' : 'kích hoạt'} sản phẩm này?
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy
        </Button>
        <Button
          color="primary"
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogStatusProduct; 