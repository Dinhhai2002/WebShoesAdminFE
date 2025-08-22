import {
  Box,
  Card,
  Typography,
  Avatar,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  AvatarGroup
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { Order } from 'src/services/API/OrderApi';

interface TopOrdersListProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
}

const TopOrdersList = ({ orders, onViewOrder }: TopOrdersListProps) => {
  const theme = useTheme();

  const getRandomColor = (index: number) => {
    const colors = [
      theme.colors.primary.main,
      theme.colors.success.main,
      theme.colors.warning.main,
      theme.colors.error.main,
      theme.colors.info.main
    ];
    return colors[index % colors.length];
  };

  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <TrendingUpIcon sx={{ color: theme.colors.primary.main, mr: 2 }} />
        <Typography variant="h5">Top 10 đơn hàng mới</Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2
      }}>
        {orders.map((order, index) => (
          <Card
            key={order.id}
            sx={{
              p: 2,
              boxShadow: 'none',
              bgcolor: alpha(theme.colors.success.lighter, 0.1),
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateX(8px)',
                '& .view-button': {
                  opacity: 1
                }
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              {/* Rank Circle */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: index < 3 ? theme.colors.success.main : alpha(theme.colors.success.main, 0.2),
                  color: index < 3 ? 'white' : theme.colors.success.main,
                  fontWeight: 'bold'
                }}
              >
                #{index + 1}
              </Avatar>

              {/* Order Info */}
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Đơn hàng #{order.id}
                  </Typography>
                  {/* <Chip
                    size="small"
                    label={`${order.total_record} sản phẩm`}
                    sx={{
                      bgcolor: alpha(getRandomColor(index), 0.1),
                      color: getRandomColor(index)
                    }}
                  /> */}
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {order.shipping_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {order.shipping_phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Products Preview & Actions */}
              <Box display="flex" alignItems="center" gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" align="right">
                    Tổng tiền
                  </Typography>
                  <Typography variant="subtitle1" color="success.main" fontWeight="bold">
                    {order.total_price.toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>

                {/* <AvatarGroup
                  max={3}
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 30,
                      height: 30,
                      fontSize: 12
                    }
                  }}
                >
                  {order.order_details?.map((detail, i) => (
                    <Avatar
                      key={i}
                      src={detail.product_detail?.image_url}
                      alt={detail.product_detail?.name}
                    >
                      <ShoppingBagIcon />
                    </Avatar>
                  ))}
                </AvatarGroup> */}

                {/* <Tooltip title="Xem chi tiết">
                  <IconButton
                    className="view-button"
                    size="small"
                    onClick={() => onViewOrder?.(order)}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      color: theme.colors.success.main,
                      '&:hover': {
                        bgcolor: alpha(theme.colors.success.main, 0.1)
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip> */}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Card>
  );
};

export default TopOrdersList;
