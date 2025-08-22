import {
  Box,
  Card,
  Typography,
  Avatar,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Product } from 'src/services/API/ProductApi';

interface TopProductsListProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
}

const TopProductsList = ({ products, onViewProduct }: TopProductsListProps) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <TrendingUpIcon sx={{ color: theme.colors.primary.main, mr: 2 }} />
        <Typography variant="h5">Top 10 sản phẩm mới</Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2
      }}>
        {products.map((product, index) => (
          <Card
            key={product.id}
            sx={{
              p: 2,
              boxShadow: 'none',
              bgcolor: alpha(theme.colors.primary.lighter, 0.1),
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
                  bgcolor: index < 3 ? theme.colors.primary.main : alpha(theme.colors.primary.main, 0.2),
                  color: index < 3 ? 'white' : theme.colors.primary.main,
                  fontWeight: 'bold'
                }}
              >
                #{index + 1}
              </Avatar>

              {/* Product Image */}
              <Avatar
                variant="rounded"
                src={product.image_url}
                sx={{ width: 64, height: 64 }}
              />

              {/* Product Info */}
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StoreIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {product.brand_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CategoryIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {product.category_name}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Price & Actions */}
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={`${product.price.toLocaleString('vi-VN')}₫`}
                  color="primary"
                  sx={{ 
                    fontWeight: 'bold',
                    bgcolor: alpha(theme.colors.primary.main, 0.1),
                    color: theme.colors.primary.main
                  }}
                />
                {/* <Tooltip title="Xem chi tiết">
                  <IconButton
                    className="view-button"
                    size="small"
                    onClick={() => onViewProduct?.(product)}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      color: theme.colors.primary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.colors.primary.main, 0.1)
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

export default TopProductsList;
