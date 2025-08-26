import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  CircularProgress,
  Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import orderApi from 'src/services/API/OrderApi';
import productDetailApi from 'src/services/API/ProductDetailApi';
import customerApi, { Customer } from 'src/services/API/CustomerApi';
import { toast } from 'react-toastify';
import ProductSelectionDialog from './ProductSelectionDialog';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VoucherDialog from './VoucherDialog';
import BarcodeScanner from './BarcodeScanner';

function CreateStaffOrderForm() {
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [products, setProducts] = useState<{ product_detail_id: number; quantity: number }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [barcodeScanOpen, setBarcodeScanOpen] = useState(false);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    productDetailApi
      .findAll({ key_search: '', status: 1, page: 1, limit: 100 })
      .then((res) => setProductDetails(res.data.list))
      .catch(() => toast.error('Không thể tải sản phẩm'));
  }, []);

  const handleAddProducts = (selected: { product_detail_id: number; quantity: number }[]) => {
    const merged = [...products];
    selected.forEach((newItem) => {
      const index = merged.findIndex((item) => item.product_detail_id === newItem.product_detail_id);
      if (index > -1) {
        merged[index].quantity += newItem.quantity;
      } else {
        merged.push(newItem);
      }
    });
    setProducts(merged);
  };

  const handleProductChange = (index: number, field: 'quantity', value: any) => {
    const updated = [...products];
    const newQuantity = Number(value);
    if(newQuantity < 1) {
      toast.error('Số lượng không hợp lệ');
      return;
    } 
    const product = productDetails.find(p => p.id === products[index].product_detail_id);
    
    if (product && newQuantity > product.stock) {
      toast.error('Số lượng vượt quá tồn kho');
      return;
    }

    updated[index][field] = newQuantity;
    setProducts(updated);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const calculatePrice = () => {
    return products.reduce((acc, item) => {
      const pd = productDetails.find((p) => p.id === item.product_detail_id);
      return acc + (pd?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = () => {
    if (products.length === 0) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleCreateOrder = async () => {
    setLoading(true);

    const price = calculatePrice();
    const total_price = price - discountAmount;

    try {
      // Nếu có số điện thoại nhưng chưa có khách hàng được chọn, tạo khách hàng mới
      if (customerPhone && !selectedCustomer) {
        if (!customerName.trim()) {
          toast.error('Vui lòng nhập tên khách hàng');
          setLoading(false);
          return;
        }
      }

      await orderApi.createByStaff({
        address_id: 0,
        payment_method: 3,
        price,
        discount_amount: discountAmount,
        total_price,
        customer_phone: customerPhone || 'Khách vãng lai',
        customer_name: customerName,
        voucher_id: selectedVoucherId,
        products: products.map((p) => ({
          product_detail_id: p.product_detail_id,
          quantity: p.quantity
        }))
      });
      toast.success('Tạo đơn hàng thành công!');
      setProducts([]);
      setCustomerPhone('');
      setCustomerName('');
      setSelectedCustomer(null);
      setConfirmOpen(false);
      setDiscountAmount(0);
      setSelectedVoucherId(null);
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    setBarcodeScanOpen(false);
    try {
      const res = await productDetailApi.getByBarcode(barcode);
      if (!res.data) {
        toast.error('Không tìm thấy sản phẩm với barcode này!');
        return;
      }
      const id = res.data.id;
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.product_detail_id === id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += 1;
          return updated;
        }
        return [...prev, { product_detail_id: id, quantity: 1 }];
      });
      toast.success('Đã thêm sản phẩm từ barcode!');
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi khi quét barcode!');
    }
  };

  const handlePhoneChange = (value: string) => {
    setCustomerPhone(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value) {
      const timeout = setTimeout(async () => {
        try {
          const response = await customerApi.findByPhone(value);
          if (response.data) {
            setCustomers(response.data);
          }
        } catch (error) {
          console.error('Error searching customer:', error);
        }
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setCustomers([]);
      setSelectedCustomer(null);
      setCustomerName('');
    }
  };

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerPhone(customer.phone);
      setCustomerName(customer.name);
    }
  };

  // Removed handleCreateCustomer as customer creation is now handled in order creation

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h3">
                Tạo đơn hàng tại quầy
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                  Thêm sản phẩm
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setBarcodeScanOpen(true)}>
                  Quét mã barcode
                </Button>
              </Stack>
            </Box>

            {/* Product List */}
            {products.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Phân loại</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((item, index) => {
                    const pd = productDetails.find((p) => p.id === item.product_detail_id);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Avatar src={pd?.image_url} variant="square" sx={{ width: 56, height: 56 }} />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography>{pd?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Barcode: {pd?.barcode || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{pd?.size} - {pd?.color} - {pd?.material}</TableCell>
                        <TableCell>{(pd?.price || 0).toLocaleString('vi-VN')}₫</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            inputProps={{ min: 1 }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {((pd?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell>
                          <Button color="error" onClick={() => handleRemoveProduct(index)}>Xóa</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có sản phẩm nào trong đơn hàng
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Hãy thêm sản phẩm bằng cách nhấn nút "Thêm sản phẩm" hoặc quét mã barcode
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Customer Information */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin khách hàng
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Số điện thoại khách hàng"
                  value={customerPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  fullWidth
                  placeholder="Để trống nếu là khách vãng lai"
                />
                {customerPhone && !selectedCustomer && (
                  <TextField
                    label="Tên khách hàng"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    fullWidth
                    placeholder="Nhập tên để tạo khách hàng mới"
                  />
                )}
                {selectedCustomer && (
                  <TextField
                    label="Tên khách hàng"
                    value={selectedCustomer.name}
                    fullWidth
                    disabled
                  />
                )}
              </Stack>

              {customers.length > 0 && !selectedCustomer && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Khách hàng tìm thấy:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {customers.map((customer) => (
                      <Button
                        key={customer.id}
                        variant="outlined"
                        size="small"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        {customer.name} - {customer.phone}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            {/* Order Summary */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tổng quan đơn hàng
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tạm tính
                  </Typography>
                  <Typography variant="h6">
                    {calculatePrice().toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Giảm giá
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6" color="info.main">
                      {discountAmount.toLocaleString('vi-VN')}₫
                    </Typography>
                    <Stack direction="row" spacing={1} flex={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LocalOfferIcon />}
                        onClick={() => setVoucherDialogOpen(true)}
                        disabled={calculatePrice() === 0}
                      >
                        {discountAmount > 0 ? 'Thay đổi' : 'Thêm voucher'}
                      </Button>
                      {discountAmount > 0 && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => {
                            setDiscountAmount(0);
                            setSelectedVoucherId(null);
                            toast.success('Đã bỏ chọn voucher');
                          }}
                        >
                          Bỏ chọn
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tổng cộng
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {(calculatePrice() - discountAmount).toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Xác nhận tạo đơn hàng
                  {loading && <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', top: '50%', ml: '-12px', mt: '-12px' }} />}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận tạo đơn hàng?"}
        </DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn tạo đơn hàng này?</Typography>
          {!customerPhone && (
            <Typography color="warning.main" sx={{ mt: 1 }}>
              Đơn hàng sẽ được tạo cho khách vãng lai.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Hủy</Button>
          <Button onClick={handleCreateOrder} autoFocus disabled={loading}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <ProductSelectionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        productDetails={productDetails}
        onSelect={handleAddProducts}
        selectedProducts={products}
      />

      <Dialog open={barcodeScanOpen} onClose={() => setBarcodeScanOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Quét hoặc nhập barcode sản phẩm</DialogTitle>
        <DialogContent>
          <BarcodeScanner onDetected={handleBarcodeDetected} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBarcodeScanOpen(false)} color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>

      <VoucherDialog
        open={voucherDialogOpen}
        onClose={() => setVoucherDialogOpen(false)}
        onApply={(amount, voucherId) => {
          setDiscountAmount(amount);
          setSelectedVoucherId(voucherId);
        }}
        totalAmount={calculatePrice()}
      />
    </Container>
  );
}

export default CreateStaffOrderForm;