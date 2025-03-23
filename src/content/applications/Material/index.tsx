import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import RecentMaterialsTable from './RecentMaterialsTable';
import materialApi from 'src/services/API/MaterialApi';
import { Material } from 'src/services/API/MaterialApi';

function MaterialManagement() {
  const [listMaterial, setListMaterial] = useState<Material[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  const fetchMaterials = async (
    keySearch: string,
    page: number,
    limit: number,
    status: number
  ) => {
    try {
      const response = await materialApi.findAll({
        key_search: keySearch,
        page,
        limit,
        status
      });
      setListMaterial(response.data.list);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchMaterials('', 1, 10, -1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý chất liệu</title>
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
            <RecentMaterialsTable
              listMaterial={listMaterial}
              totalRecord={totalRecord}
              onClickPagination={fetchMaterials}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default MaterialManagement;