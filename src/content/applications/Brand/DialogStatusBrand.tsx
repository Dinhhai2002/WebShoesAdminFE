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
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import { useState } from 'react';
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
  const [selectedStatus, setSelectedStatus] = useState<number>(currentStatus);

  const handleChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

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
        Thay đổi trạng thái thương hiệu #{id}
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
            <MenuItem value={StatusEnum.ON}>Hoạt động</MenuItem>
            <MenuItem value={StatusEnum.OFF}>Không hoạt động</MenuItem>
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

export default DialogStatusBrand; 