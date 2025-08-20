import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Avatar,
  Typography,
  Paper,
  Stack,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogStatusProductDetail from './DialogStatusProductDetail';
import DialogEditProductDetail from './DialogEditProductDetail';
import DialogDetailProductDetail from './DialogDetailProductDetail';
import { useState } from 'react';
import { ProductDetail } from 'src/services/API/ProductDetailApi';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';

interface TableListProductDetailProps {
  listProductDetail: ProductDetail[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

function TableListProductDetail({
  listProductDetail,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh,
  isLoading = false
}: TableListProductDetailProps) {
  const theme = useTheme();
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const handleClickOpenStatusDialog = (id: number, status: number) => {
    setSelectedId(id);
    setSelectedStatus(status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedId(0);
  };

  const handleClickOpenEditDialog = (id: number) => {
    setSelectedId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedId(0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}
              >
                {labelTable.map((label) => (
                  <TableCell 
                    key={label.id}
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    {label.label}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listProductDetail.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={labelTable.length + 2} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Không có dữ liệu
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : listProductDetail.map((product) => (
                <TableRow 
                  hover 
                  key={product.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02)
                    }
                  }}
                >
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={product.image_url}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {product.product_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={product.color}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main
                        }}
                      />
                      <Chip
                        label={product.size}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main
                        }}
                      />
                      <Chip
                        label={product.material}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {formatPrice(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      color={product.stock > 10 ? 'success.main' : product.stock > 0 ? 'warning.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        product.stock === 0
                          ? <BlockIcon />
                          : product.status === 1
                            ? <CheckCircleIcon />
                            : <BlockIcon />
                      }
                      label={
                        product.stock === 0
                          ? 'Hết hàng'
                          : product.status === 1
                            ? 'Hoạt động'
                            : 'Tạm khóa'
                      }
                      color={
                        product.stock === 0
                          ? 'warning'
                          : product.status === 1
                            ? 'success'
                            : 'error'
                      }
                      size="small"
                      sx={{
                        '& .MuiChip-icon': {
                          fontSize: 16
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleClickOpenEditDialog(product.id)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={product.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                        <IconButton
                          size="small"
                          onClick={() => handleClickOpenStatusDialog(product.id, product.status)}
                          sx={{
                            color: product.status === 1 ? 'error.main' : 'success.main',
                            '&:hover': {
                              backgroundColor: alpha(
                                product.status === 1 ? theme.palette.error.main : theme.palette.success.main,
                                0.1
                              )
                            }
                          }}
                        >
                          {product.status === 1 ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedDetailId(product.id);
                          setOpenDetailDialog(true);
                        }}
                        sx={{
                          color: 'info.main',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.info.main, 0.1)
                          }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {listProductDetail.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Tổng số: {listProductDetail.length} sản phẩm
            </Typography>
          </Box>
        )}
      </Paper>

      <DialogStatusProductDetail
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditProductDetail
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />

      <DialogDetailProductDetail
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        id={selectedDetailId}
      />
    </>
  );
}

export default TableListProductDetail;