import { Box, Container, Grid, Card, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import RecentOrders from './RecentOrders';
import { useTheme } from '@mui/material/styles';
import orderApi from 'src/services/API/OrderApi';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';

function Order() {
  const theme = useTheme();
  const [changeData, setChangeData] = useState<number>(0);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Fetch order statistics
    const fetchStatistics = async () => {
      try {
        const response = await orderApi.findAll({
          key_search: '',
          status: StatusOrderEnum.ALL,
          page: 1,
          limit: 100,
          payment_status: PaymentStatusEnum.PAID,
          payment_method: -1
        });
        
        setStatistics({
          totalOrders: response.data.total_record || 0,
          pendingOrders: response.data.list.filter(order => order.status === StatusOrderEnum.PENDING).length,
          processingOrders: response.data.list.filter(order => 
            order.status === StatusOrderEnum.PROCESSING || 
            order.status === StatusOrderEnum.CONFIRMED ||
            order.status === StatusOrderEnum.SHIPPED
          ).length,
          completedOrders: response.data.list.filter(order => order.status === StatusOrderEnum.DELIVERED).length,
          cancelledOrders: response.data.list.filter(order => order.status === StatusOrderEnum.CANCELLED).length,
          totalRevenue: response.data.list.reduce((sum, order) => sum + order.total_price, 0)
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [changeData]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{ mb: 2, textAlign: 'center' }}
        >
          * Thống kê dựa trên 100 đơn hàng gần nhất
        </Typography>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                px: 3,
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant="h3" color="primary">
                {statistics.totalOrders}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Tổng đơn hàng
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                px: 3,
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: theme.palette.warning.light
              }}
            >
              <Typography variant="h3" color="warning.dark">
                {statistics.pendingOrders}
              </Typography>
              <Typography variant="subtitle2" color="warning.dark">
                Đơn chờ xử lý
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                px: 3,
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: theme.palette.info.light
              }}
            >
              <Typography variant="h3" color="info.dark">
                {statistics.processingOrders}
              </Typography>
              <Typography variant="subtitle2" color="info.dark">
                Đơn đang xử lý
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                px: 3,
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: theme.palette.success.light
              }}
            >
              <Typography variant="h3" color="success.dark">
                {statistics.completedOrders}
              </Typography>
              <Typography variant="subtitle2" color="success.dark">
                Đơn hoàn thành
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                px: 3,
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: theme.palette.error.light
              }}
            >
              <Typography variant="h3" color="error.dark">
                {statistics.cancelledOrders}
              </Typography>
              <Typography variant="subtitle2" color="error.dark">
                Đơn đã hủy
              </Typography>
            </Card>
          </Grid>

          {/* Orders Table */}
          <Grid item xs={12}>
            <RecentOrders changeData={changeData} setChangeData={setChangeData} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Order; 