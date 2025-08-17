import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom,
  Typography,
  Box
} from '@mui/material';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import Label from 'src/components/Label';

interface DialogStatusBrandProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusBrand({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusBrandProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = () => {
    handleChangeStatus(id);
    onClose();
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case StatusEnum.ON:
        return 'success';
      case StatusEnum.OFF:
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case StatusEnum.ON:
        return 'Hoạt động';
      case StatusEnum.OFF:
        return 'Không hoạt động';
      default:
        return 'Không xác định';
    }
  };

  const getNewStatus = (currentStatus: number) => {
    return currentStatus === StatusEnum.ON ? 'không hoạt động' : 'hoạt động';
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
        Xác nhận thay đổi trạng thái
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn thay đổi trạng thái của thương hiệu #{id} từ{' '}
            <Label color={getStatusColor(currentStatus)}>
              {getStatusText(currentStatus)}
            </Label>
            {' '}sang{' '}
            <Label color={getStatusColor(currentStatus === StatusEnum.ON ? StatusEnum.OFF : StatusEnum.ON)}>
              {getStatusText(currentStatus === StatusEnum.ON ? StatusEnum.OFF : StatusEnum.ON)}
            </Label>
            ?
          </Typography>
        </Box>
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

export default DialogStatusBrand;