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
import { ChangeEvent } from 'react';

interface DialogStatusBannerProps {
  open: boolean;
  onClose: () => void;
  id: number;
  currentStatus: number;
  handleChangeStatus: (id: number) => void;
}

function DialogStatusBanner({
  open,
  onClose,
  id,
  currentStatus,
  handleChangeStatus
}: DialogStatusBannerProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusColor = (status: number) => {
    return status === 1 ? 'success' : 'error';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Hoạt động' : 'Không hoạt động';
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 600 }}
      aria-labelledby="responsive-dialog-title"
      aria-describedby="responsive-dialog-description"
    >
      <DialogTitle id="responsive-dialog-title">
        Thay đổi trạng thái banner
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Trạng thái hiện tại:
          </Typography>
          <Typography
            variant="body1"
            color={getStatusColor(currentStatus)}
            sx={{ mb: 2 }}
          >
            {getStatusText(currentStatus)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Chọn trạng thái mới:
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={currentStatus === 1 ? 0 : 1}
              label="Trạng thái"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChangeStatus(id);
              }}
            >
              <MenuItem value={1}>Không hoạt động</MenuItem>
              <MenuItem value={0}>hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogStatusBanner; 