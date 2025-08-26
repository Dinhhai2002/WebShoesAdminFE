import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import cancelOrderApi from 'src/services/API/CancelOrderApi';
import { toast } from 'react-toastify';
import RecentCancelOrdersTable from './RecentCancelOrdersTable';

function RecentCancelOrders({ changeData }: any) {
  const [listCancelOrders, setListCancelOrders] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchCancelOrders = (page: number, limit: number, status?: string) => {
    setLoading(true);
    cancelOrderApi.getAll({ page, limit, status })
      .then((response) => {
        setListCancelOrders(response.data.list || []);
        setTotalRecord(response.data.total_record || 0);
      })
      .catch((error) => {
        console.error('Error fetching cancel orders:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi tải danh sách yêu cầu hủy đơn hàng!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCancelOrders(1, 10);
  }, []);

  useEffect(() => {
    fetchCancelOrders(1, 10);
  }, [changeData]);

  const onClickPagination = (page: number, limit: number, status?: string) => {
    fetchCancelOrders(page, limit, status);
  };

  return (
    <Card>
      <RecentCancelOrdersTable
        listCancelOrders={listCancelOrders}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
        loading={loading}
      />
    </Card>
  );
}

export default RecentCancelOrders; 