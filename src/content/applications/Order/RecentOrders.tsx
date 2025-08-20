import { Card, Box, useTheme } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import orderApi from 'src/services/API/OrderApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import RecentOrdersTable from './RecentOrdersTable';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

interface RecentOrdersProps {
  changeData: number;
  setChangeData: (value: number) => void;
}

function RecentOrders({ changeData, setChangeData }: RecentOrdersProps) {
  const theme = useTheme();
  const [listOrder, setListOrder] = useState([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: '',
    status: StatusOrderEnum.ALL,
    page: PAGE_DEFAULT,
    limit: LIMIT_DEFAULT,
    paymentStatus: -1,
    paymentMethod: -1
  });

  const fetchOrders = useCallback(async (
    valueSearch: string,
    statusValue: number,
    page: number,
    limit: number,
    paymentStatusValue: number,
    paymentMethodValue: number
  ) => {
    setLoading(true);
    try {
      const response = await orderApi.findAll({
        key_search: valueSearch,
        status: statusValue,
        page: page,
        limit: limit,
        payment_status: paymentStatusValue,
        payment_method: paymentMethodValue
      });
      
      setListOrder(response.data.list);
      setTotalRecord(response.data.total_record);
      setChangeData(changeData + 1); // Trigger statistics update
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error?.message || 'Đã có lỗi xảy ra khi tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  }, [setChangeData]);

  // Debounced search function
  const debouncedFetch = useCallback(
    debounce(
      (filters) => {
        fetchOrders(
          filters.search,
          filters.status,
          filters.page,
          filters.limit,
          filters.paymentStatus,
          filters.paymentMethod
        );
      },
      500
    ),
    [fetchOrders]
  );

  useEffect(() => {
    debouncedFetch(filters);
  }, [filters, debouncedFetch]);

  const handleFilterChange = (filterName: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterName === 'page' ? Number(value) : value,
      page: filterName === 'page' ? Number(value) : PAGE_DEFAULT // Reset page when other filters change
    }));
  };

  return (
    <Card
      sx={{
        p: 0,
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[3]
        }
      }}
    >
      <Box sx={{ height: '100%' }}>
        <RecentOrdersTable
          listOrder={listOrder}
          totalRecord={totalRecord}
          onFilterChange={handleFilterChange}
          filters={filters}
          loading={loading}
        />
      </Box>
    </Card>
  );
}

export default RecentOrders; 