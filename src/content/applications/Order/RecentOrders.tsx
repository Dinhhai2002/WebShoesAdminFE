import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import orderApi from 'src/services/API/OrderApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import RecentOrdersTable from './RecentOrdersTable';

function RecentOrders({ changeData }: any) {
  const [listOrder, setListOrder] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  
  const fetchOrders = (
    valueSearch: string,
    statusValue: number,
    page: number,
    limit: number,
    paymentStatusValue: number,
    paymentMethodValue: number
  ) => {
    orderApi.findAll({
      key_search: valueSearch,
      status: statusValue,
      page: page,
      limit: limit,
      payment_status: paymentStatusValue,
      payment_method: paymentMethodValue
    })
      .then((response) => {
        setListOrder(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchOrders('', StatusOrderEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT, -1, -1);
  }, []);

  useEffect(() => {
    fetchOrders('', StatusOrderEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT, -1, -1);
  }, [changeData]);

  const onClickPagination = (
    valueSearch: string,
    page: number,
    limit: number,
    statusValue: number,
    paymentStatusValue: number,
    paymentMethodValue: number
  ) => {
    fetchOrders(valueSearch, statusValue, page, limit, paymentStatusValue, paymentMethodValue);
  };

  return (
    <Card>
      <RecentOrdersTable
        listOrder={listOrder}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentOrders; 