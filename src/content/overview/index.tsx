import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar
} from '@mui/material';
import TopProductsList from './components/TopProductsList';
import TopOrdersList from './components/TopOrdersList';
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
      const res = await productApi.findAll({ key_search: '', status: 1, page: 1, limit: 10 });
      setTopProducts(res.data.list);
    } catch {
      toast.error('Không thể tải sản phẩm mới');
    }
  };

  const fetchTopOrders = async () => {
    try {
      const res = await orderApi.findByPaymentStatuses({ payment_statuses: "1,2", page: 0, limit: 10 });
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
    // {
    //   label: 'Tổng doanh thu',
    //   value: stats?.total_revenue?.toLocaleString('vi-VN') + '₫',
    //   icon: <MonetizationOn />
    // },
    // {
    //   label: 'Doanh thu hàng ngày',
    //   value: stats?.daily_revenue?.toLocaleString('vi-VN') + '₫',
    //   icon: <MonetizationOn />
    // },
    // {
    //   label: 'Doanh thu tháng này',
    //   value: stats?.monthly_revenue?.toLocaleString('vi-VN') + '₫',
    //   icon: <MonetizationOn />
    // },
    // {
    //   label: 'Doanh thu năm nay',
    //   value: stats?.yearly_revenue?.toLocaleString('vi-VN') + '₫',
    //   icon: <MonetizationOn />
    // }
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
          <TopProductsList
            products={topProducts}
            onViewProduct={(product) => {
              // Xử lý xem chi tiết sản phẩm
              console.log('View product:', product);
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TopOrdersList
            orders={topOrders}
            onViewOrder={(order) => {
              // Xử lý xem chi tiết đơn hàng
              console.log('View order:', order);
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Overview;
