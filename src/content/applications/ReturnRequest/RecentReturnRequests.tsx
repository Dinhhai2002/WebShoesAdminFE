import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import returnRequestApi from 'src/services/API/ReturnRequestApi';
import { toast } from 'react-toastify';
import RecentReturnRequestsTable from './RecentReturnRequestsTable';
import { ReturnStatus } from 'src/constants/ReturnRequestConstants';

function RecentReturnRequests({ changeData }: any) {
  const [listReturnRequests, setListReturnRequests] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchReturnRequests = (status?: string) => {
    setLoading(true);
    returnRequestApi.getAllReturnRequests(status)
      .then((response) => {
        setListReturnRequests(response.data);
        setTotalRecord(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching return requests:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi tải danh sách yêu cầu đổi trả hàng!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  useEffect(() => {
    fetchReturnRequests();
  }, [changeData]);

  const onClickPagination = (status?: string) => {
    fetchReturnRequests(status);
  };

  return (
    <Card>
      <RecentReturnRequestsTable
        listReturnRequests={listReturnRequests}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
        loading={loading}
      />
    </Card>
  );
}

export default RecentReturnRequests; 