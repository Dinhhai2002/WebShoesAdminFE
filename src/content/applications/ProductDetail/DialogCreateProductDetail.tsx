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
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import productDetailApi, { CRUDProductDetailRequest } from 'src/services/API/ProductDetailApi';
import productApi from 'src/services/API/ProductApi';
import colorApi from 'src/services/API/ColorApi';
import sizeApi from 'src/services/API/SizeApi';
import materialApi from 'src/services/API/MaterialApi';
import brandApi from 'src/services/API/BrandApi';
import categoryApi from 'src/services/API/CategoryApi';

interface DialogCreateProductDetailProps {
  open: boolean;
  onClose: () => void;
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

function DialogCreateProductDetail({ open, onClose }: DialogCreateProductDetailProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const methods = useForm<ProductDetailFormData>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: {
      name: '',
      product_id: 0,
      color_id: 0,
      size_id: 0,
      material_id: 0,
      brand_id: 1,
      category_id: 1,
      price: 0,
      stock: 0
    }
  });

  const { handleSubmit, reset, watch, setValue, formState, control, register } = methods;

  // Lấy productId để dùng trong useEffect
  const productId = watch('product_id');

  // Set price when product changes
  useEffect(() => {
    if (productId && products.length > 0) {
      const selectedProduct = products.find((p) => p.id === productId);
      if (selectedProduct && typeof selectedProduct.price === 'number') {
        setValue('price', selectedProduct.price);
      }
    }
  }, [productId, products, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, colorsRes, sizesRes, materialsRes, brandsRes, categoriesRes] = await Promise.all([
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

  const onSubmitHandler: SubmitHandler<ProductDetailFormData> = async (data) => {
    try {
      setLoading(true);
      await productDetailApi.create(data as CRUDProductDetailRequest);
      toast.success('Thêm sản phẩm chi tiết mới thành công!');
      reset();
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
      <DialogTitle>Thêm sản phẩm con mới</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
              fullWidth
              label="Tên sản phẩm con"
              margin="normal"
              name="name"
              onChange={(e) => setValue('name', e.target.value)}
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message}
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
            {/* <FormControl fullWidth margin="normal">
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
            </FormControl> */}
            {/* <FormControl fullWidth margin="normal">
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
            </FormControl> */}
            <FormControl fullWidth margin="normal">
              <TextField
                label="Giá"
                type="number"
                {...register('price', { valueAsNumber: true })}
                fullWidth
                margin="normal"
              />
            </FormControl>
            <TextField
              fullWidth
              label="Số lượng"
              margin="normal"
              type="number"
              name="stock"
              onChange={(e) => setValue('stock', Number(e.target.value))}
              error={!!formState.errors.stock}
              helperText={formState.errors.stock?.message}
            />
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
          Thêm mới
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCreateProductDetail;