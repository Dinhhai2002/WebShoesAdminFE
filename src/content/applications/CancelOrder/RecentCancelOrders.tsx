import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import cancelOrderApi from 'src/services/API/CancelOrderApi';
import { toast } from 'react-toastify';
import RecentCancelOrdersTable from './RecentCancelOrdersTable';

function RecentCancelOrders({ changeData }: any) {
  const [listCancelOrders, setListCancelOrders] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchCancelOrders = (status?: string) => {
    setLoading(true);
    cancelOrderApi.getAllCancelRequests(status)
      .then((response) => {
        setListCancelOrders(response.data);
        setTotalRecord(response.data.length);
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
    fetchCancelOrders();
  }, []);

  useEffect(() => {
    fetchCancelOrders();
  }, [changeData]);

  const onClickPagination = (status?: string) => {
    fetchCancelOrders(status);
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