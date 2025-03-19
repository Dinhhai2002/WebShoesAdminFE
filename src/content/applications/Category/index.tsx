import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from './RecentOrders';
import { useState } from 'react';

function ApplicationsClass() {
  const [changeData, setChangeData] = useState(false);
  return (
    <>
      <Helmet>
        <title>Danh mục</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader setChangeData={setChangeData} changeData={changeData} />
      </PageTitleWrapper>
      <Container sx={{ marginTop: 10 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders changeData={changeData} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsClass;
