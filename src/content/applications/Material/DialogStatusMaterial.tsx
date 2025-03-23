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
import materialApi from 'src/services/API/MaterialApi';

interface DialogStatusMaterialProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusMaterial({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusMaterialProps) {
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
        {currentStatus === 1 ? 'Tạm khóa chất liệu' : 'Kích hoạt chất liệu'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {currentStatus === 1
            ? 'Bạn có chắc chắn muốn tạm khóa chất liệu này?'
            : 'Bạn có chắc chắn muốn kích hoạt chất liệu này?'}
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

export default DialogStatusMaterial;