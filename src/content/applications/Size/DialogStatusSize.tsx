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
import sizeApi from 'src/services/API/SizeApi';

interface DialogStatusSizeProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusSize({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusSizeProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // await sizeApi.changeStatus(id);
      // toast.success(currentStatus === 1 ? 'Tạm khóa size thành công!' : 'Kích hoạt size thành công!');
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
        {currentStatus === 1 ? 'Tạm khóa size' : 'Kích hoạt size'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {currentStatus === 1
            ? 'Bạn có chắc chắn muốn tạm khóa size này?'
            : 'Bạn có chắc chắn muốn kích hoạt size này?'}
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

export default DialogStatusSize; 