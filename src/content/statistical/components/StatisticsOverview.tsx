import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const IconWrapper = styled(Box)(
  ({ theme }) => `
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.shape.borderRadius}px;
`
);

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: JSX.Element;
  color: string;
}

const StatCard = ({ title, value, trend, icon, color }: StatCardProps) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <IconWrapper sx={{ bgcolor: alpha(color, 0.1) }}>
              {icon}
            </IconWrapper>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" color="textSecondary" noWrap>
              {title}
            </Typography>
            <Typography variant="h4" gutterBottom noWrap>
              {value}
            </Typography>
            <Box display="flex" alignItems="center">
              {trend > 0 ? (
                <TrendingUpIcon sx={{ color: theme.colors.success.main }} />
              ) : (
                <TrendingDownIcon sx={{ color: theme.colors.error.main }} />
              )}
              <Typography
                variant="subtitle2"
                sx={{
                  pl: 0.5,
                  color: trend > 0 ? theme.colors.success.main : theme.colors.error.main
                }}
              >
                {Math.abs(trend)}% so với kỳ trước
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface StatisticsOverviewProps {
  data: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
    revenueTrend: number;
    ordersTrend: number;
    avgOrderTrend: number;
    customersTrend: number;
  };
}

const StatisticsOverview = ({ data }: StatisticsOverviewProps) => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(data.totalRevenue)}
          trend={data.revenueTrend}
          icon={<MonetizationOnIcon sx={{ color: theme.colors.primary.main }} />}
          color={theme.colors.primary.main}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Số đơn hàng"
          value={data.totalOrders.toLocaleString()}
          trend={data.ordersTrend}
          icon={<ShoppingCartIcon sx={{ color: theme.colors.warning.main }} />}
          color={theme.colors.warning.main}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Giá trị đơn trung bình"
          value={formatCurrency(data.averageOrderValue)}
          trend={data.avgOrderTrend}
          icon={<ReceiptIcon sx={{ color: theme.colors.success.main }} />}
          color={theme.colors.success.main}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          title="Số khách hàng"
          value={data.totalCustomers.toLocaleString()}
          trend={data.customersTrend}
          icon={<PeopleIcon sx={{ color: theme.colors.info.main }} />}
          color={theme.colors.info.main}
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsOverview;

