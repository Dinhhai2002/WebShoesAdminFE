import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import RecentSizesTable from './RecentSizesTable';
import sizeApi from 'src/services/API/SizeApi';
import { Size } from 'src/services/API/SizeApi';

function SizeManagement() {
  const [listSize, setListSize] = useState<Size[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchSizes = async (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    try {
      const response = await sizeApi.findAll({
        key_search: keySearch,
        page,
        limit,
        status
      });
      setListSize(response.data.list);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    fetchSizes('', 1, 10, -1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý size</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <PageHeader />
          </Grid>
          <Grid item xs={12}>
            <RecentSizesTable
              listSize={listSize}
              totalRecord={totalRecord}
              onClickPagination={fetchSizes}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default SizeManagement; 