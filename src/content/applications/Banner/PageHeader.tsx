import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
  Container
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import bannerApi from 'src/services/API/BannerApi';

interface PageHeaderProps {
  onSuccess: () => void;
}

function PageHeader({ onSuccess }: PageHeaderProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Vui lòng chọn một file ảnh');
      return;
    }

    try {
      setLoading(true);
      await bannerApi.create(file);
      toast.success('Thêm banner thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error('Thêm banner thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3, px: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h2">
              Quản lý Banner
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                px: 3,
                py: 1
              }}
            >
              Thêm banner mới
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 600 }}
        aria-labelledby="responsive-dialog-title"
        aria-describedby="responsive-dialog-description"
      >
        <DialogTitle id="responsive-dialog-title">
          Thêm banner mới
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="file"
              onChange={handleFileChange}
              margin="normal"
              required
              inputProps={{
                accept: 'image/*'
              }}
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
            {loading ? 'Đang xử lý...' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PageHeader; 