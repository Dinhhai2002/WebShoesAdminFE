import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import categoryApi from 'src/services/API/CategoryApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import { RecentOrdersTable } from './RecentOrdersTable';

function RecentOrders({ changeData }: any) {
  const [listCategory, setListCategory] = useState([]);
  const [totalRecord, setTotalRecord] = useState<any>(0);
  const fetchCategory = (
    valueSearch: string,
    statusValue: number,
    page: number,
    limit: number
  ) => {
    categoryApi.findAll({
      keySearch: valueSearch,
      status: statusValue,
      page: page,
      limit: limit
    })
      .then((response) => {
        setListCategory(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    fetchCategory('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, []);

  useEffect(() => {
    fetchCategory('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, [changeData]);

  const onClickPagination = (
    valueSearch: string,
    page: number,
    limit: number,
    statusValue: number
  ) => {
    fetchCategory(valueSearch, statusValue, page, limit);
  };

  return (
    <Card>
      <RecentOrdersTable
        listCategory={listCategory}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentOrders;
