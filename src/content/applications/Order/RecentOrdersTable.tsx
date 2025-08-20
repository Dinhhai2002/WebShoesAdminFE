import {
  Box,
  Card,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  TablePagination,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { createContext, useState } from 'react';
import Empty from 'src/components/Empty/Empty';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import orderApi from 'src/services/API/OrderApi';
import {
  labelTableOrder,
  statusOptionsOrder,
  paymentStatusOptions,
  paymentMethodOptions
} from 'src/utils/LabelTable';
import { EditSuccess } from 'src/utils/MessageToast';
import TableListOrder from './TableListOrder';

interface RecentOrdersTableProps {
  listOrder: any[];
  totalRecord: number;
  onFilterChange: (filterName: string, value: string | number) => void;
  filters: {
    search: string;
    status: number;
    page: number;
    limit: number;
    paymentStatus: number;
    paymentMethod: number;
  };
  loading?: boolean;
}

const OrderContext = createContext(null);

const RecentOrdersTable = ({
  listOrder,
  totalRecord,
  onFilterChange,
  filters,
  loading = false
}: RecentOrdersTableProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = useState(false);

  const handleChangeStatusOrder = async (id: number, status: number) => {
    try {
      await orderApi.changeStatus(id, status);
      toast.success(EditSuccess);
      // Refresh the current page
      onFilterChange('page', filters.page);
    } catch (error) {
      console.error('Error changing order status:', error);
      toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái đơn hàng!');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onFilterChange('page', newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('limit', parseInt(event.target.value, 10));
  };

  const handleRefresh = () => {
    onFilterChange('page', 1);
  };

  return (
    <OrderContext.Provider value={{ onFilterChange }}>
      <Card>
        <ToastContainer />
        <CardHeader
          title="Danh sách đơn hàng"
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Tìm kiếm đơn hàng..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 250 }}
              />
              <Tooltip title="Lọc">
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Làm mới">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />

        {showFilters && (
          <Box sx={{ p: 2, bgcolor: 'background.default' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái đơn hàng</InputLabel>
                  <Select
                    value={filters.status}
                    label="Trạng thái đơn hàng"
                    onChange={(e) => onFilterChange('status', Number(e.target.value))}
                  >
                    {statusOptionsOrder.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái thanh toán</InputLabel>
                  <Select
                    value={filters.paymentStatus}
                    label="Trạng thái thanh toán"
                    onChange={(e) => onFilterChange('paymentStatus', Number(e.target.value))}
                  >
                    {paymentStatusOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phương thức thanh toán</InputLabel>
                  <Select
                    value={filters.paymentMethod}
                    label="Phương thức thanh toán"
                    onChange={(e) => onFilterChange('paymentMethod', Number(e.target.value))}
                  >
                    {paymentMethodOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableListOrder
              listOrder={listOrder}
              labelTable={labelTableOrder}
              handleChangeStatusOrder={handleChangeStatusOrder}
            />

            {listOrder.length > 0 ? (
              <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <TablePagination
                  component="div"
                  count={totalRecord}
                  page={filters.page - 1}
                  onPageChange={handleChangePage}
                  rowsPerPage={filters.limit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  labelRowsPerPage="Số hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} trên ${count}`
                  }
                />
              </Box>
            ) : (
              <Box p={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Empty />
              </Box>
            )}
          </>
        )}
      </Card>
    </OrderContext.Provider>
  );
};

export default RecentOrdersTable; 