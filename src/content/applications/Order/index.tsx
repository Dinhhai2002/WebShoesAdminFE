import { Box, Container, Grid } from '@mui/material';
import { useState } from 'react';
import RecentOrders from './RecentOrders';

function Order() {
  const [changeData, setChangeData] = useState<number>(0);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RecentOrders changeData={changeData} setChangeData={setChangeData} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Order; 