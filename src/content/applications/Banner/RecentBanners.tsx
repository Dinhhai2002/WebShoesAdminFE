import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import bannerApi from 'src/services/API/BannerApi';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/utils/Constant';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import RecentBannersTable from './RecentBannersTable';

interface RecentBannersProps {
  changeData: boolean;
}

function RecentBanners({ changeData }: RecentBannersProps) {
  const [listBanner, setListBanner] = useState([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchBanners = (
    keySearch: string,
    status: number,
    page: number,
    limit: number
  ) => {
    bannerApi
      .findAll({
        key_search: keySearch,
        status: status === -1 ? undefined : status,
        page: page,
        limit: limit
      })
      .then((response) => {
        setListBanner(response.data.list);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  };

  useEffect(() => {
    fetchBanners('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, []);

  useEffect(() => {
    fetchBanners('', StatusEnum.ALL, PAGE_DEFAULT, LIMIT_DEFAULT);
  }, [changeData]);

  const onClickPagination = (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    fetchBanners(keySearch, status, page, limit);
  };

  return (
    <Card>
      <RecentBannersTable
        listBanner={listBanner}
        totalRecord={totalRecord}
        onClickPagination={onClickPagination}
      />
    </Card>
  );
}

export default RecentBanners; 