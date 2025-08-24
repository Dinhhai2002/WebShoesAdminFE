import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import cancelOrderApi, { CancelOrderResponse } from 'src/services/API/CancelOrderApi';
import { toast } from 'react-toastify';
import RecentCancelOrdersTable from './RecentCancelOrdersTable';

function RecentCancelOrders({ changeData }: any) {
  const [listCancelOrders, setListCancelOrders] = useState<CancelOrderResponse[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchCancelOrders = (limit: number, page: number, status?: string) => {
    setLoading(true);
    cancelOrderApi.getAll({
      page: page,
      limit: limit,
      status: status
    })
      .then((response) => {
        setListCancelOrders(response.data.list);
        setTotalRecord(response.data.total_record);
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
    fetchCancelOrders(10, 1);
  }, []);

  useEffect(() => {
    fetchCancelOrders(10, 1);
  }, [changeData]);

  const onClickPagination = (limit?: number, page?: number, status?: string) => {
    fetchCancelOrders(limit, page, status);
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