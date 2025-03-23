import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom,
  Box,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import bannerApi from 'src/services/API/BannerApi';
import { toast } from 'react-toastify';

interface DialogEditBannerProps {
  id: number;
  openDialog: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

function DialogEditBanner({
  id,
  openDialog,
  handleClose,
  onSuccess
}: DialogEditBannerProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (openDialog && id) {
      fetchBannerData();
    }
  }, [openDialog, id]);

  const fetchBannerData = async () => {
    try {
      const response = await bannerApi.findOne(id);
      setUrl(response.data.url);
    } catch (error) {
      console.error('Error fetching banner:', error);
      toast.error('Không thể tải thông tin banner');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await bannerApi.update(id, url);
      toast.success('Cập nhật banner thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error('Cập nhật banner thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleClose}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 600 }}
      aria-labelledby="responsive-dialog-title"
      aria-describedby="responsive-dialog-description"
    >
      <DialogTitle id="responsive-dialog-title">
        Chỉnh sửa banner
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            margin="normal"
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEditBanner; 