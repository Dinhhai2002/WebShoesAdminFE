import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import RecentColorsTable from './RecentColorsTable';
import colorApi from 'src/services/API/ColorApi';
import { Color } from 'src/services/API/ColorApi';

function ColorManagement() {
  const [listColor, setListColor] = useState<Color[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchColors = async (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    try {
      const response = await colorApi.findAll({
        key_search: keySearch,
        page,
        limit,
        status
      });
      setListColor(response.data.list);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  useEffect(() => {
    fetchColors('', 1, 10, -1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý màu sắc</title>
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
            <RecentColorsTable
              listColor={listColor}
              totalRecord={totalRecord}
              onClickPagination={fetchColors}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ColorManagement;