import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import productApi from 'src/services/API/ProductApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import RecentProductsTable from './RecentProductsTable';

interface RecentProductsProps {
  changeData: boolean;
}

function RecentProducts({ changeData }: RecentProductsProps) {
  const [listProduct, setListProduct] = useState([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchProducts = (
    keySearch: string,
    status: number,
    page: number,
    limit: number
  ) => {
    productApi
      .findAll({
        keySearch,
        status: status === -1 ? undefined : status,
        page,
        limit
      })
      .then((response) => {
        setListProduct(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchProducts('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, []);

  useEffect(() => {
    fetchProducts('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, [changeData]);

  const onClickPagination = (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    fetchProducts(keySearch, status, page, limit);
  };

  return (
    <Card>
      <RecentProductsTable
        listProduct={listProduct}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentProducts; 