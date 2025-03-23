import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar
} from '@mui/material';
import { useEffect, useState } from 'react';
import orderApi from 'src/services/API/OrderApi';
import addressBookApi from 'src/services/API/AddressBookApi';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';
import ProductSelectionDialog from './ProductSelectionDialog';
import DialogCreateAddress from './DialogCreateAddress';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

function CreateStaffOrderForm() {
  const [addressList, setAddressList] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | ''>('');
  const [products, setProducts] = useState<{ product_detail_id: number; quantity: number }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');

  const fetchAddresses = () => {
    addressBookApi
      .findAll({ keySearch: '', status: 1, page: 1, limit: 100 })
      .then((res) => setAddressList(res.data.list))
      .catch(() => toast.error('Không thể tải danh sách địa chỉ'));
  };

  useEffect(() => {
    fetchAddresses();
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
    updated[index][field] = Number(value);
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

  const handleSubmit = async () => {
    if (!selectedAddressId || products.length === 0 || !customerPhone) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const price = calculatePrice();
    const discount_amount = 0;
    const total_price = price - discount_amount;

    try {
      await orderApi.createByStaff({
        address_id: selectedAddressId,
        payment_method: 3,
        price,
        discount_amount,
        total_price,
        customer_phone: customerPhone,
        products: products.map((p) => ({
          product_detail_id: p.product_detail_id,
          quantity: p.quantity
        }))
      });
      toast.success('Tạo đơn hàng thành công!');
      setProducts([]);
      setSelectedAddressId('');
      setCustomerPhone('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi tạo đơn hàng');
    }
  };

  return (
    <Container sx={{ mt: 2 }} >
      <Typography variant="h3" gutterBottom>
        Tạo đơn hàng bởi nhân viên
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>Địa chỉ giao hàng</InputLabel>
                <Select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                  label="Địa chỉ giao hàng"
                >
                  {addressList.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.full_name} - {a.full_address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={() => setOpenAddressDialog(true)}>
                Tạo địa chỉ mới
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Số điện thoại khách hàng"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              fullWidth
            />
          </Grid>

          {products.length > 0 && (
            <Grid item xs={12}>
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
                        <TableCell>{pd?.name}</TableCell>
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
            </Grid>
          )}

          <Grid display="flex" justifyContent="flex-end" item xs={12}>
            <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mt: 1 }}>
              Thêm sản phẩm
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="flex-end" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShippingIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Phí vận chuyển: <span style={{ color: '#1976d2' }}>0₫</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <MonetizationOnIcon color="success" />
                <Typography variant="h6" fontWeight="bold">
                  Tổng tiền: <span style={{ color: '#2e7d32' }}>{calculatePrice().toLocaleString('vi-VN')}₫</span>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid display="flex" justifyContent="flex-end" item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Xác nhận tạo đơn hàng
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <ProductSelectionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        productDetails={productDetails}
        onSelect={handleAddProducts}
      />

      <DialogCreateAddress
        open={openAddressDialog}
        onClose={() => setOpenAddressDialog(false)}
        onSuccess={() => fetchAddresses()}
      />
    </Container>
  );
}

export default CreateStaffOrderForm;
