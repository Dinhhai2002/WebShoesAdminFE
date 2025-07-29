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
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import productApi from 'src/services/API/ProductApi';
import brandApi from 'src/services/API/BrandApi';
import categoryApi from 'src/services/API/CategoryApi';
import DialogUploadProductImages from './DialogUploadProductImages';

interface PageHeaderProps {
  onSuccess: () => void;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

function PageHeader({ onSuccess }: PageHeaderProps) {
  const [open, setOpen] = useState(false);
  const [openUploadImages, setOpenUploadImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    category_id: '',
    description: '',
    price: '',
    image_url: '',
    status: 1
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Fetch brands and categories
    brandApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 })
      .then(response => setBrands(response.data.list))
      .catch(error => console.error('Error fetching brands:', error));

    categoryApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 })
      .then(response => setCategories(response.data.list))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenUploadImages = () => {
    setOpenUploadImages(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      brand_id: '',
      category_id: '',
      description: '',
      price: '',
      image_url: '',
      status: 1
    });
  };

  const handleCloseUploadImages = () => {
    setOpenUploadImages(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.brand_id) {
      toast.error('Vui lòng chọn thương hiệu');
      return;
    }
    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }
    if (!formData.price) {
      toast.error('Vui lòng nhập giá sản phẩm');
      return;
    }

    try {
      setLoading(true);
      await productApi.create({
        name: formData.name,
        brand_id: Number(formData.brand_id),
        category_id: Number(formData.category_id),
        description: formData.description,
        price: Number(formData.price),
        image_url: "",
        status: Number(formData.status),
        average_rating: 0
      });
      toast.success('Thêm sản phẩm thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error?.message || 'Thêm sản phẩm thất bại!');
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
              Quản lý Sản phẩm
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
              Thêm sản phẩm mới
            </Button>
            <Button
              variant="contained"
              onClick={handleClickOpenUploadImages} 
              sx={{
                ml: 1,
                px: 3,
                py: 1
              }}
            >
              Tải ảnh sản phẩm
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">
          Thêm sản phẩm mới
        </DialogTitle>
        <DialogContent sx={{ minWidth: 500 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleSelectChange}
                label="Thương hiệu"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleSelectChange}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Giá"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleTextChange}
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description?.replace(/<[^>]*>/g, '')} // Strip HTML tags
              onChange={handleTextChange}
              multiline
              rows={4}
            />
            {/* <TextField
              fullWidth
              label="URL hình ảnh"
              name="image_url"
              value={formData.image_url}
              onChange={handleTextChange}
            /> */}
            {/* <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="Trạng thái"
              >
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Tạm khóa</MenuItem>
              </Select>
            </FormControl> */}
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

      <DialogUploadProductImages
        open={openUploadImages}
        onClose={handleCloseUploadImages}
      />
    </Container>
  );
}

export default PageHeader; 