import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import { formatCurrency } from 'src/utils/formatCurrency';
import productDetailApi from 'src/services/API/ProductDetailApi';

interface ProductDetail {
  id: number;
  name: string;
  image_url: string;
  color: string;
  size: string;
  material: string;
  price: number;
  stock: number;
  product_id: number;
}

interface ExchangeProduct {
  old_product_id: number;
  old_product_detail_id: number;
  new_product_id: number;
  new_product_detail_id: number;
  quantity: number;
  exchange_reason: string;
}

interface DialogSelectExchangeProductProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (exchangeProducts: ExchangeProduct[], adminNotes?: string, priceDifference?: number) => void;
  returnRequest: any;
  loading?: boolean;
}

const DialogSelectExchangeProduct = ({
  open,
  onClose,
  onConfirm,
  returnRequest,
  loading = false
}: DialogSelectExchangeProductProps) => {
  const [availableProducts, setAvailableProducts] = useState<ProductDetail[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ExchangeProduct[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [priceDifference, setPriceDifference] = useState<number>(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (open && returnRequest) {
      loadAvailableProducts();
      initializeSelectedProducts();
    }
  }, [open, returnRequest]);

  const loadAvailableProducts = async () => {
    if (!returnRequest?.details) return;
    
    setLoadingProducts(true);
    try {
      // Lấy tất cả sản phẩm con từ cùng sản phẩm cha
      const productIds = [...new Set(returnRequest.details.map((detail: any) => detail.product_detail_id))];

      
      const allProducts: ProductDetail[] = [];
      for (const productId of productIds) {
        if (productId) {
          const response = await productDetailApi.findOne(productId as number);
          const listProductDetail = await productDetailApi.findAll({
            product_id: response.data.product_id
          });
          const products = listProductDetail.data.list;
          allProducts.push(...products);
        }
      }
      
      setAvailableProducts(allProducts);
    } catch (error) {
      console.error('Error loading available products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const initializeSelectedProducts = () => {
    if (!returnRequest?.details) return;
    
    const initialProducts: ExchangeProduct[] = returnRequest.details.map((detail: any) => ({
      old_product_id: detail.product_id,
      old_product_detail_id: detail.product_detail_id,
      new_product_id: detail.product_id, // Mặc định giữ nguyên sản phẩm cha
      new_product_detail_id: detail.product_detail_id, // Mặc định giữ nguyên
      quantity: detail.quantity,
      exchange_reason: detail.return_reason
    }));
    
    setSelectedProducts(initialProducts);
    calculatePriceDifference(initialProducts);
  };

  const calculatePriceDifference = (products: ExchangeProduct[]) => {
    let difference = 0;
    
    products.forEach((product) => {
      const oldProduct = returnRequest.details.find((detail: any) => detail.product_detail_id === product.old_product_detail_id);
      const newProduct = availableProducts.find(p => p.id === product.new_product_detail_id);
      
      if (oldProduct?.product_detail && newProduct) {
        const oldPrice = oldProduct.product_detail.price * product.quantity;
        const newPrice = newProduct.price * product.quantity;
        difference += (newPrice - oldPrice);
      }
    });
    
    setPriceDifference(difference);
  };

  const handleProductChange = (oldProductId: number, newProductId: number) => {
    const updatedProducts = selectedProducts.map(product => 
      product.old_product_detail_id === oldProductId 
        ? { 
            ...product, 
            new_product_detail_id: newProductId,
            new_product_id: availableProducts.find(p => p.id === newProductId)?.product_id || product.new_product_id
          }
        : product
    );
    
    setSelectedProducts(updatedProducts);
    calculatePriceDifference(updatedProducts);
  };

  const handleQuantityChange = (oldProductId: number, quantity: number) => {
    const updatedProducts = selectedProducts.map(product => 
      product.old_product_detail_id === oldProductId 
        ? { ...product, quantity }
        : product
    );
    
    setSelectedProducts(updatedProducts);
    calculatePriceDifference(updatedProducts);
  };

  const handleConfirm = () => {
    onConfirm(selectedProducts, adminNotes, priceDifference);
  };

  const getProductById = (id: number) => {
    return availableProducts.find(product => product.id === id);
  };

  const getOldProductById = (id: number) => {
    console.log(returnRequest);
    return returnRequest?.details?.find((detail: any) => detail.product_detail_id === id);
  };

  if (!returnRequest) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Chọn sản phẩm đổi cho yêu cầu #{returnRequest.id}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Thông tin chung */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Mã đơn hàng:</strong> #{returnRequest.order_id} | 
              <strong> Loại:</strong> {returnRequest.return_type}
            </Typography>
          </Alert>

          {/* Danh sách sản phẩm cần đổi */}
          <Typography variant="h6" gutterBottom>
            Sản phẩm cần đổi
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm cũ</TableCell>
                  <TableCell>Sản phẩm mới</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá cũ</TableCell>
                  <TableCell>Giá mới</TableCell>
                  <TableCell>Chênh lệch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product, index) => {
                  const oldProduct = getOldProductById(product.old_product_detail_id);
                  const newProduct = getProductById(product.new_product_detail_id);
                  const oldPrice = oldProduct?.price || 0;
                  const newPrice = newProduct?.price || 0;
                  const difference = (newPrice - oldPrice) * product.quantity;
                  
                  return (
                    <TableRow key={product.old_product_detail_id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img 
                            src={oldProduct?.image_url} 
                            alt={oldProduct?.name}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {oldProduct?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {oldProduct?.color} - {oldProduct?.size}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={product.new_product_detail_id}
                            onChange={(e) => handleProductChange(product.old_product_detail_id, e.target.value as number)}
                            disabled={loadingProducts}
                          >
                            {availableProducts
                              .filter(p => p.product_id === oldProduct?.product_id)
                              .map((availableProduct) => (
                                <MenuItem key={availableProduct.id} value={availableProduct.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <img 
                                      src={availableProduct.image_url} 
                                      alt={availableProduct.name}
                                      style={{ width: 30, height: 30, objectFit: 'cover' }}
                                    />
                                    <Box>
                                      <Typography variant="body2">
                                        {availableProduct.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {availableProduct.color} - {availableProduct.size} 
                                        (Tồn: {availableProduct.stock})
                                      </Typography>
                                      <Typography variant="caption" color="primary">
                                        Giá: {availableProduct.price?.toLocaleString('vi-VN')}₫
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={product.quantity}
                          disabled={true}
                          onChange={(e) => handleQuantityChange(product.old_product_detail_id, parseInt(e.target.value) || 0)}
                          inputProps={{ min: 1, max: oldProduct?.stock || 1 }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        {formatCurrency(oldPrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(newPrice)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatCurrency(difference)}
                          color={difference > 0 ? 'error' : difference < 0 ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tổng chênh lệch giá */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Tổng chênh lệch giá
            </Typography>
            <Chip
              label={formatCurrency(priceDifference)}
              color={priceDifference > 0 ? 'error' : priceDifference < 0 ? 'success' : 'default'}
              size="medium"
              sx={{ fontSize: '1.1rem' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {priceDifference > 0 ? 'Khách hàng cần thanh toán thêm' : 
               priceDifference < 0 ? 'Cần hoàn tiền cho khách hàng' : 
               'Không có chênh lệch giá'}
            </Typography>
          </Box>

          {/* Ghi chú admin */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (tùy chọn)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Nhập ghi chú nếu cần..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary"
          disabled={loading || selectedProducts.length === 0}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đổi hàng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSelectExchangeProduct; 