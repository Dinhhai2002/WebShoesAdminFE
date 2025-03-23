import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import brandApi from 'src/services/API/BrandApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import RecentBrandsTable from './RecentBrandsTable';

interface RecentBrandsProps {
  changeData: boolean;
}

function RecentBrands({ changeData }: RecentBrandsProps) {
  const [listBrand, setListBrand] = useState([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchBrands = (
    keySearch: string,
    status: number,
    page: number,
    limit: number
  ) => {
    brandApi
      .findAll({
        key_search: keySearch,
        status: status,
        page: page,
        limit: limit
      })
      .then((response) => {
        setListBrand(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  };

  useEffect(() => {
    fetchBrands('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, []);

  useEffect(() => {
    fetchBrands('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, [changeData]);

  const onClickPagination = (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    fetchBrands(keySearch, status, page, limit);
  };

  return (
    <Card>
      <RecentBrandsTable
        listBrand={listBrand}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentBrands; 