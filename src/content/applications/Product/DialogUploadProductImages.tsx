import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Zoom,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

// API
import productApi, { Product } from 'src/services/API/ProductApi';

interface DialogUploadProductImagesProps {
  open: boolean;
  onClose: () => void;
}

// Ví dụ: user chọn 1 sản phẩm từ dropdown, sau đó upload nhiều ảnh
function DialogUploadProductImages({ open, onClose }: DialogUploadProductImagesProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Danh sách sản phẩm
  const [products, setProducts] = useState<Product[]>([]);
  // ID sản phẩm được chọn
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  // ================== Load danh sách sản phẩm khi mở dialog ==================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.findAll({
          keySearch: '',
          status: 1,
          page: 1,
          limit: 100
        });
        setProducts(res.data.list);
      } catch (error) {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    };

    if (open) {
      // Mở dialog -> load product
      fetchProducts();
      // Reset
      setFiles([]);
      setSelectedProductId(0);
    }
  }, [open]);

  // ================== Khi chọn file ==================
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // ================== Xóa 1 file khỏi list ==================
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ================== Upload ==================
  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh');
      return;
    }
    if (!selectedProductId) {
      toast.error('Vui lòng chọn Sản phẩm');
      return;
    }

    try {
      setLoading(true);
      await productApi.uploadImages(selectedProductId, files);
      toast.success('Upload hình ảnh thành công!');
      // Reset
      setFiles([]);
      setSelectedProductId(0);
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Không thể upload ảnh');
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
      transitionDuration={500}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Upload nhiều hình ảnh cho Sản phẩm</DialogTitle>
      <DialogContent dividers>
        {/* Dropdown chọn Sản phẩm */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Sản phẩm</InputLabel>
          <Select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            label="Sản phẩm"
          >
            <MenuItem value={0}>-- Chọn sản phẩm --</MenuItem>
            {products.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>
                {prod.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nút chọn file */}
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Chọn ảnh
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleFileChange}
          />
        </Button>

        {/* Preview file */}
        {files.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Danh sách ảnh đã chọn:
            </Typography>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  p: 1,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1
                }}
              >
                {/* Preview tạm */}
                <Box
                  component="img"
                  sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                />
                <Typography
                  variant="body2"
                  sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {file.name} - {(file.size / 1024).toFixed(2)} KB
                </Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Chưa chọn ảnh nào
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleUpload}
          loading={loading}
        >
          Upload
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogUploadProductImages;
