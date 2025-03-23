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
    Stack
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import orderApi from 'src/services/API/OrderApi';
  import addressBookApi from 'src/services/API/AddressBookApi';
  import productDetailApi from 'src/services/API/ProductDetailApi';
  import { toast } from 'react-toastify';
  import ProductSelectionDialog from './ProductSelectionDialog';
import DialogCreateAddress from './DialogCreateAddress';
  
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
          payment_method: 3, // STORE (Thanh toán tại quầy)
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
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
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
  
            {products.map((item, index) => {
              const pd = productDetails.find((p) => p.id === item.product_detail_id);
              return (
                <Grid item xs={12} key={index} container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <Typography>{pd?.name} - {pd?.size} - {pd?.color} - {pd?.material}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Số lượng"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="outlined" color="error" onClick={() => handleRemoveProduct(index)}>
                      Xóa
                    </Button>
                  </Grid>
                </Grid>
              );
            })}
  
            <Grid item xs={12}>
              <Button variant="contained" onClick={() => setOpenDialog(true)}>
                Thêm sản phẩm
              </Button>
            </Grid>
  
            <Grid item xs={12}>
              <Typography variant="h6">
                Tổng tiền: {calculatePrice().toLocaleString('vi-VN')}₫
              </Typography>
            </Grid>
  
            <Grid item xs={12}>
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
          onSuccess={() => {
            fetchAddresses();
          }}
        />
      </Container>
    );
  }
  
  export default CreateStaffOrderForm;
  