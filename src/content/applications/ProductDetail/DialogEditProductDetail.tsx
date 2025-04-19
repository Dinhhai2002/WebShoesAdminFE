import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import productDetailApi, { CRUDProductDetailRequest, ProductDetail } from 'src/services/API/ProductDetailApi';
import productApi from 'src/services/API/ProductApi';
import colorApi from 'src/services/API/ColorApi';
import sizeApi from 'src/services/API/SizeApi';
import materialApi from 'src/services/API/MaterialApi';
import brandApi from 'src/services/API/BrandApi';
import categoryApi from 'src/services/API/CategoryApi';

interface DialogEditProductDetailProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}

const productDetailSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm con không được để trống'),
  product_id: z.number().min(1, 'Vui lòng chọn sản phẩm'),
  color_id: z.number().min(1, 'Vui lòng chọn màu sắc'),
  size_id: z.number().min(1, 'Vui lòng chọn size'),
  material_id: z.number().min(1, 'Vui lòng chọn chất liệu'),
  brand_id: z.number().min(1, 'Vui lòng chọn thương hiệu'),
  category_id: z.number().min(1, 'Vui lòng chọn danh mục'),
  price: z.number().min(0, 'Giá không được âm'),
  stock: z.number().min(0, 'Số lượng không được âm')
});

type ProductDetailFormData = z.infer<typeof productDetailSchema>;

function DialogEditProductDetail({ open, onClose, id, onSuccess }: DialogEditProductDetailProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const methods = useForm<ProductDetailFormData>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: {
      name: '',
      product_id: 0,
      color_id: 0,
      size_id: 0,
      material_id: 0,
      brand_id: 0,
      category_id: 0,
      price: 0,
      stock: 0
    }
  });

  const { handleSubmit, reset, watch, setValue } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          colorsRes,
          sizesRes,
          materialsRes,
          brandsRes,
          categoriesRes
        ] = await Promise.all([
          productApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          colorApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          sizeApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          materialApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          brandApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          categoryApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 })
        ]);

        setProducts(productsRes.data.list);
        setColors(colorsRes.data.list);
        setSizes(sizesRes.data.list);
        setMaterials(materialsRes.data.list);
        setBrands(brandsRes.data.list);
        setCategories(categoriesRes.data.list);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!open || !id) return;

      try {
        setLoading(true);
        const response = await productDetailApi.findOne(id);
        const productDetail = response.data;
        setImageUrl(productDetail.image_url);
        reset({
          name: productDetail.name,
          product_id: productDetail.product_id,
          color_id: productDetail.color_id,
          size_id: productDetail.size_id,
          material_id: productDetail.material_id,
          brand_id: productDetail.brand_id,
          category_id: productDetail.category_id,
          price: productDetail.price,
          stock: productDetail.stock
        });
      } catch (error) {
        toast.error('Không thể tải thông tin sản phẩm con');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [open, id, reset]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadLoading(true);
      const response = await productDetailApi.uploadImage(id, selectedFile); // bạn cần có endpoint này
      setImageUrl(response.data.image_url);
      toast.success('Upload ảnh thành công!');
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error?.message || 'Đã có lỗi!');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const onSubmitHandler: SubmitHandler<ProductDetailFormData> = async (data) => {
    try {
      setLoading(true);
      await productDetailApi.update(id, {
        ...data,
        image_url: imageUrl
      });
      
      toast.success('Cập nhật sản phẩm con thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra!');
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Chỉnh sửa sản phẩm con</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
              fullWidth
              label="Tên sản phẩm con"
              margin="normal"
              name="name"
              onChange={(e) => setValue('name', e.target.value)}
              value={watch('name')}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Sản phẩm</InputLabel>
              <Select
                value={watch('product_id')}
                onChange={(e) => setValue('product_id', Number(e.target.value))}
                label="Sản phẩm"
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Màu sắc</InputLabel>
              <Select
                value={watch('color_id')}
                onChange={(e) => setValue('color_id', Number(e.target.value))}
                label="Màu sắc"
              >
                {colors.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Size</InputLabel>
              <Select
                value={watch('size_id')}
                onChange={(e) => setValue('size_id', Number(e.target.value))}
                label="Size"
              >
                {sizes.map((size) => (
                  <MenuItem key={size.id} value={size.id}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chất liệu</InputLabel>
              <Select
                value={watch('material_id')}
                onChange={(e) => setValue('material_id', Number(e.target.value))}
                label="Chất liệu"
              >
                {materials.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                value={watch('brand_id')}
                onChange={(e) => setValue('brand_id', Number(e.target.value))}
                label="Thương hiệu"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={watch('category_id')}
                onChange={(e) => setValue('category_id', Number(e.target.value))}
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
              margin="normal"
              type="number"
              name="price"
              onChange={(e) => setValue('price', Number(e.target.value))}
              value={watch('price')}
            />
            <TextField
              fullWidth
              label="Số lượng"
              margin="normal"
              type="number"
              name="stock"
              onChange={(e) => setValue('stock', Number(e.target.value))}
              value={watch('stock')}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hình ảnh sản phẩm con
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {(imageUrl || previewUrl) && (
                    <Box
                      component="img"
                      src={previewUrl || imageUrl}
                      alt="Product Detail"
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLoading || !!previewUrl}
                  >
                    <CloudUploadIcon />
                  </IconButton>
                </Box>

                {previewUrl && (
                  <Stack direction="row" spacing={1}>
                    <LoadingButton
                      color="success"
                      onClick={handleConfirmUpload}
                      loading={uploadLoading}
                      startIcon={<CheckIcon />}
                      variant="contained"
                    >
                      Xác nhận upload
                    </LoadingButton>
                    <Button
                      color="error"
                      onClick={handleCancelUpload}
                      startIcon={<CloseIcon />}
                      variant="outlined"
                    >
                      Hủy
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy
        </Button>
        <LoadingButton
          color="primary"
          onClick={handleSubmit(onSubmitHandler)}
          loading={loading}
          variant="contained"
        >
          Cập nhật
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEditProductDetail;