import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

// API
import productDetailApi, { CRUDProductDetailRequest } from 'src/services/API/ProductDetailApi';
import productApi from 'src/services/API/ProductApi';
import brandApi from 'src/services/API/BrandApi';
import categoryApi from 'src/services/API/CategoryApi';
import colorApi from 'src/services/API/ColorApi';
import sizeApi from 'src/services/API/SizeApi';
import materialApi from 'src/services/API/MaterialApi';

// Kiểu cho dialog
interface DialogCreateMultipleProductDetailProps {
  open: boolean;
  onClose: () => void;
}

// Mã ví dụ
function DialogCreateMultipleProductDetail({ open, onClose }: DialogCreateMultipleProductDetailProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  // Form selections
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  // Chứa ID của color/size/material user đã check
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);

  // Thông tin giá, tồn kho, ...
  const [price, setPrice] = useState<number>(1);
  const [stock, setStock] = useState<number>(0);

  // Tên prefix, optional => name = prefix + color + size + material
  const [namePrefix, setNamePrefix] = useState<string>("");

  // 1. Load data khi open
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, brandRes, catRes, colorRes, sizeRes, matRes] = await Promise.all([
          productApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          brandApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          categoryApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          colorApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          sizeApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 }),
          materialApi.findAll({ key_search: '', status: 1, page: 1, limit: 100 })
        ]);

        setProducts(productRes.data.list);
        setBrands(brandRes.data.list);
        setCategories(catRes.data.list);
        setColors(colorRes.data.list);
        setSizes(sizeRes.data.list);
        setMaterials(matRes.data.list);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
      }
    };

    if (open) {
      fetchData();
      // Reset form
      setSelectedProduct(0);
      setSelectedBrand(0);
      setSelectedCategory(0);
      setSelectedColors([]);
      setSelectedSizes([]);
      setSelectedMaterials([]);
      setPrice(0);
      setStock(0);
      setNamePrefix("");
    }
  }, [open]);

  // Set price when selectedProduct changes
  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const selected = products.find((p) => p.id === selectedProduct);
      if (selected && typeof selected.price === 'number') {
        setPrice(selected.price);
      }
    }
  }, [selectedProduct, products]);

  // Helper to toggle item in array
  const toggleSelection = (selected: number[], id: number): number[] =>
    selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id];

  // Abstracted toggle handlers
  const handleToggleColor = useCallback((id: number) => {
    setSelectedColors((prev) => toggleSelection(prev, id));
  }, []);
  const handleToggleSize = useCallback((id: number) => {
    setSelectedSizes((prev) => toggleSelection(prev, id));
  }, []);
  const handleToggleMaterial = useCallback((id: number) => {
    setSelectedMaterials((prev) => toggleSelection(prev, id));
  }, []);

  // Memoize menu items for performance if lists are large
  const productMenuItems = useMemo(() => [
    <MenuItem value={0} key={0}>-- Chọn sản phẩm --</MenuItem>,
    ...products.map((prod) => (
      <MenuItem key={prod.id} value={prod.id}>{prod.name}</MenuItem>
    ))
  ], [products]);

  // 3. Submit => createAll permutations
  const handleCreateMultiple = useCallback(async () => {
    if (!selectedProduct) {
      toast.error("Vui lòng chọn Sản phẩm, Thương hiệu, Danh mục");
      return;
    }
    if (!selectedColors.length || !selectedSizes.length || !selectedMaterials.length) {
      toast.error("Vui lòng tích chọn ít nhất 1 màu, 1 size, 1 chất liệu");
      return;
    }
    if(stock <= 0) {
      toast.error("số lượng phải lớn hơn 0");
      return;
    }

    try {
      setLoading(true);

      // Tạo permutations
      const productDetails: CRUDProductDetailRequest[] = [];
      // Lấy name + brand + cat + product => optional
      // Vd. brand, category => k bắt buộc cho name, do user có 1 brand/cat
      // => user có brand/cat => map

      // Lặp
      for (const cid of selectedColors) {
        for (const sid of selectedSizes) {
          for (const mid of selectedMaterials) {
            // Tìm actual name color/size/material => Optional
            const colorObj = colors.find((c: any) => c.id === cid);
            const sizeObj = sizes.find((c: any) => c.id === sid);
            const matObj = materials.find((c: any) => c.id === mid);

            const detailName = `${namePrefix} ${colorObj?.name || ''} / ${sizeObj?.name || ''} / ${matObj?.name || ''}`.trim();

            productDetails.push({
              name: detailName,
              product_id: selectedProduct,
              color_id: cid,
              size_id: sid,
              material_id: mid,
              brand_id: selectedBrand,
              category_id: selectedCategory,
              price: price,
              stock: stock  
            });
          }
        }
      }

      await productDetailApi.createMany(productDetails);
      toast.success(`Tạo thành công ${productDetails.length} sản phẩm con!`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tạo nhiều sản phẩm con');
    } finally {
      setLoading(false);
    }
  }, [selectedProduct, selectedColors, selectedSizes, selectedMaterials, selectedBrand, selectedCategory, price, stock, namePrefix, colors, sizes, materials, onClose]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Tạo nhiều sản phẩm con</DialogTitle>
      <DialogContent dividers>
        {/* Chọn Sản phẩm (cha), Brand, Category */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Sản phẩm cha</InputLabel>
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
            label="Sản phẩm"
          >
            {productMenuItems}
          </Select>
        </FormControl>
        {/* <FormControl fullWidth margin="normal">
          <InputLabel>Thương hiệu</InputLabel>
          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(Number(e.target.value))}
            label="Thương hiệu"
          >
            <MenuItem value={0}>-- Chọn brand --</MenuItem>
            {brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            label="Danh mục"
          >
            <MenuItem value={0}>-- Chọn category --</MenuItem>
            {categories.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* Checkbox Màu sắc */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Màu sắc:
        </Typography>
        <FormGroup row>
          {colors.map((c: any) => (
            <FormControlLabel
              key={c.id}
              control={
                <Checkbox
                  checked={selectedColors.includes(c.id)}
                  onChange={() => handleToggleColor(c.id)}
                />
              }
              label={c.name}
            />
          ))}
        </FormGroup>

        {/* Checkbox Size */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Size:
        </Typography>
        <FormGroup row>
          {sizes.map((s: any) => (
            <FormControlLabel
              key={s.id}
              control={
                <Checkbox
                  checked={selectedSizes.includes(s.id)}
                  onChange={() => handleToggleSize(s.id)}
                />
              }
              label={s.name}
            />
          ))}
        </FormGroup>

        {/* Checkbox Chất liệu */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Chất liệu:
        </Typography>
        <FormGroup row>
          {materials.map((m: any) => (
            <FormControlLabel
              key={m.id}
              control={
                <Checkbox
                  checked={selectedMaterials.includes(m.id)}
                  onChange={() => handleToggleMaterial(m.id)}
                />
              }
              label={m.name}
            />
          ))}
        </FormGroup>

        {/* Thông tin dùng chung: Tên prefix, giá, tồn kho */}
        <TextField
          fullWidth
          margin="normal"
          label="Tiền tố tên (Prefix)"
          placeholder="VD: Giày Mùa Hè"
          value={namePrefix}
          onChange={(e) => setNamePrefix(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <TextField
            label="Giá"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Tồn kho"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          inputProps={{ min: 0 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" disabled={loading}>
          Hủy
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleCreateMultiple}
          loading={loading}
        >
          Tạo
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCreateMultipleProductDetail;
