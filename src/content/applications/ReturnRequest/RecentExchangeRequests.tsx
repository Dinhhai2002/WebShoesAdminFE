import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import exchangeRequestApi from 'src/services/API/ExchangeRequestApi';
import { toast } from 'react-toastify';
import RecentExchangeRequestsTable from './RecentExchangeRequestsTable';

function RecentExchangeRequests({ changeData }: any) {
  const [listExchangeRequests, setListExchangeRequests] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchExchangeRequests = () => {
    setLoading(true);
    exchangeRequestApi.getAllExchangeRequests()
      .then((response) => {
        setListExchangeRequests(response.data);
        setTotalRecord(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching exchange requests:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi tải danh sách yêu cầu đổi hàng!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExchangeRequests();
  }, []);

  useEffect(() => {
    fetchExchangeRequests();
  }, [changeData]);

  const onClickPagination = () => {
    fetchExchangeRequests();
  };

  return (
    <Card>
      <RecentExchangeRequestsTable
        listExchangeRequests={listExchangeRequests}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
        loading={loading}
      />
    </Card>
  );
}

export default RecentExchangeRequests; 