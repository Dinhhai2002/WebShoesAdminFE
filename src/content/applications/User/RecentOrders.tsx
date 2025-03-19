import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import userApiService from 'src/services/API/UserApiService';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import { RecentOrdersTable } from './RecentOrdersTable';

function RecentOrders({ changeData }: any) {
  const [listUser, setListUser] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  
  const fetchUsers = (
    valueSearch: string,
    statusValue: number,
    page: number,
    limit: number
  ) => {
    userApiService.getAllUsers({
      key_search: valueSearch,
      status: statusValue,
      page: page,
      limit: limit
    })
      .then((response) => {
        setListUser(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchUsers('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, []);

  useEffect(() => {
    fetchUsers('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, [changeData]);

  const onClickPagination = (
    valueSearch: string,
    page: number,
    limit: number,
    statusValue: number
  ) => {
    fetchUsers(valueSearch, statusValue, page, limit);
  };

  return (
    <Card>
      <RecentOrdersTable
        listUser={listUser}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentOrders; 