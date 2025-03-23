import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { toast } from 'react-toastify';
import productDetailApi from 'src/services/API/ProductDetailApi';

interface DialogStatusProductDetailProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusProductDetail({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusProductDetailProps) {
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
        {currentStatus === 1 ? 'Tạm khóa sản phẩm con' : 'Kích hoạt sản phẩm con'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {currentStatus === 1
            ? 'Bạn có chắc chắn muốn tạm khóa sản phẩm con này?'
            : 'Bạn có chắc chắn muốn kích hoạt sản phẩm con này?'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy
        </Button>
        <LoadingButton
          color="primary"
          onClick={handleConfirm}
          loading={loading}
          variant="contained"
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogStatusProductDetail;