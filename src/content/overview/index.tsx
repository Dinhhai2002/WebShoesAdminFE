import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { People, ShoppingCart, Store, MonetizationOn } from '@mui/icons-material';
import statisticalApi, { WebsiteStatisticalResponse } from 'src/services/API/StatisticalApi';
import productApi, { Product } from 'src/services/API/ProductApi';
import orderApi, { Order } from 'src/services/API/OrderApi';
import { toast } from 'react-toastify';

function Overview() {
  const [stats, setStats] = useState<WebsiteStatisticalResponse | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [topOrders, setTopOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchStats();
    fetchTopProducts();
    fetchTopOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await statisticalApi.getOverview();
      setStats(res.data);
    } catch {
      toast.error('Không thể tải thống kê');
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await productApi.findAll({ keySearch: '', status: 1, page: 1, limit: 10 });
      setTopProducts(res.data.list);
    } catch {
      toast.error('Không thể tải sản phẩm mới');
    }
  };

  const fetchTopOrders = async () => {
    try {
      const res = await orderApi.findAll({ page: 1, limit: 10 });
      setTopOrders(res.data.list);
    } catch {
      toast.error('Không thể tải đơn hàng mới');
    }
  };

  const statBoxes = [
    {
      label: 'Tổng người dùng',
      value: stats?.total_users ?? '-',
      icon: <People />
    },
    {
      label: 'Tổng sản phẩm',
      value: stats?.total_products ?? '-',
      icon: <Store />
    },
    {
      label: 'Tổng đơn hàng',
      value: stats?.total_orders ?? '-',
      icon: <ShoppingCart />
    },
    {
      label: 'Tổng doanh thu',
      value: stats?.total_revenue?.toLocaleString('vi-VN') + '₫',
      icon: <MonetizationOn />
    },
    {
      label: 'Doanh thu hàng ngày',
      value: stats?.daily_revenue?.toLocaleString('vi-VN') + '₫',
      icon: <MonetizationOn />
    },
    {
      label: 'Doanh thu tháng này',
      value: stats?.monthly_revenue?.toLocaleString('vi-VN') + '₫',
      icon: <MonetizationOn />
    },
    {
      label: 'Doanh thu năm nay',
      value: stats?.yearly_revenue?.toLocaleString('vi-VN') + '₫',
      icon: <MonetizationOn />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tổng quan hệ thống
      </Typography>

      <Grid container spacing={3}>
        {statBoxes.map((box, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{box.icon}</Avatar>
                <Box>
                  <Typography variant="body2">{box.label}</Typography>
                  <Typography variant="h5">{box.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Top 10 sản phẩm mới
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell align="right">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.brand_name}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell align="right">{product.price.toLocaleString('vi-VN')}₫</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Top 10 đơn hàng mới
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Khách</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.shipping_name}</TableCell>
                  <TableCell>{order.shipping_phone}</TableCell>
                  <TableCell align="right">{order.total_price.toLocaleString('vi-VN')}₫</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Overview;
