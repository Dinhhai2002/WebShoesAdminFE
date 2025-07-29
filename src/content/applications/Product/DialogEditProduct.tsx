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
  Typography,
  IconButton,
  Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import productApi from 'src/services/API/ProductApi';
import brandApi from 'src/services/API/BrandApi';
import categoryApi from 'src/services/API/CategoryApi';
import FormInput from 'src/components/FormReact/FormInput';
import { Brand } from 'src/services/API/BrandApi';
import { Category } from 'src/services/API/CategoryApi';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface DialogEditProductProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  brand_id: z.number().min(0, 'Vui lòng chọn thương hiệu'),
  category_id: z.number().min(0, 'Vui lòng chọn danh mục'),
  description: z.string().min(0, 'Mô tả không được để trống'),
  price: z.union([z.string(), z.number()]).transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      throw new Error('Giá phải là số và lớn hơn 0');
    }
    return num;
  }),
  status: z.number().min(0).max(1)
});

type ProductFormData = z.infer<typeof productSchema>;

function DialogEditProduct({ open, onClose, id, onSuccess }: DialogEditProductProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand_id: 0,
      category_id: 0,
      description: '',
      price: 0,
      status: 1
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandApi.getAll();
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (error: any) {
        toast.error(error?.message || 'Có lỗi xảy ra');
        console.error('Error fetching categories:', error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (open && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await productApi.getById(id);
          const product = response.data;
          setImageUrl(product.image_url);
          reset({
            name: product.name,
            brand_id: product.brand_id,
            category_id: product.category_id,
            description: product.description,
            price: product.price,
            status: product.status
          });
        } catch (error: any) {
          toast.error(error?.message || 'Không thể tải thông tin sản phẩm');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [open, id, reset]);

  const onSubmitHandler: SubmitHandler<ProductFormData> = async (data) => {
    try {
      setLoading(true);
      await productApi.update(id, {
        ...data,
        image_url: imageUrl // Keep the existing image URL
      });
      toast.success('Cập nhật sản phẩm thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
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
      const response = await productApi.uploadImage(id, selectedFile);
      setImageUrl(response.data.image_url);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast.success('Cập nhật hình ảnh thành công!');
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi upload hình ảnh!');
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
      <DialogTitle id="responsive-dialog-title">Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput
              name="name"
              label="Tên sản phẩm"
              type="text"
              fullWidth
              sx={{ mt:2, mb: 2 }}
            />
            <FormInput
              name="brand_id"
              label="Thương hiệu"
              type="select"
              disabled={true}
              fullWidth
              sx={{ mb: 2 }}
              options={brands.map((brand) => ({
                value: brand.id,
                label: brand.name
              }))}
            />
            <FormInput
              name="category_id"
              label="Danh mục"
              type="select"
              disabled={true}
              fullWidth
              sx={{ mb: 2 }}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name
              }))}
            />
            <FormInput
              name="description"
              label="Mô tả"
              type="textarea"
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormInput
              name="price"
              label="Giá"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hình ảnh sản phẩm
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {(imageUrl || previewUrl) && (
                    <Box
                      component="img"
                      src={previewUrl || imageUrl}
                      alt="Product"
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
            {/* <FormInput
              name="status"
              label="Trạng thái"
              type="select"
              fullWidth
              sx={{ mb: 2 }}
              options={[
                { value: 1, label: 'Hoạt động' },
                { value: 0, label: 'Tạm khóa' }
              ]}
            /> */}
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

export default DialogEditProduct; 