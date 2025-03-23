import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import RecentBrands from './RecentBrands';
import { useState } from 'react';

function ApplicationsBrand() {
  const [changeData, setChangeData] = useState(false);

  return (
    <>
      <Helmet>
        <title>Quản lý thương hiệu</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader setChangeData={setChangeData} changeData={changeData} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentBrands changeData={changeData} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsBrand; 