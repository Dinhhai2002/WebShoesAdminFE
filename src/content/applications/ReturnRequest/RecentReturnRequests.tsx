import { useEffect, useState } from 'react';
import returnRequestApi, { ReturnRequestResponse } from 'src/services/API/ReturnRequestApi';
import RecentReturnRequestsTable from './RecentReturnRequestsTable';
import { Card } from '@mui/material';

const RecentReturnRequests = () => {
  const [loading, setLoading] = useState(false);
  const [listReturnRequests, setListReturnRequests] = useState<ReturnRequestResponse[]>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const fetchReturnRequests = async (params: {
    user_id?: number;
    key_search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    try {
      setLoading(true);
      const response = await returnRequestApi.getAll({
        key_search: params.key_search || '',
        status: params.status || '',
        page: params.page || 1,
        limit: params.limit || 10,
        user_id: params.user_id
      });

      setListReturnRequests(response.data.list);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.error('Error fetching return requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  return (
    <Card>
      <RecentReturnRequestsTable 
        listReturnRequests={listReturnRequests}
        totalRecord={totalRecord}
        loading={loading}
        onRefresh={fetchReturnRequests}
      />
    </Card>
  );
};

export default RecentReturnRequests; 