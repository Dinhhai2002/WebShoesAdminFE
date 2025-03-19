import { Box } from '@mui/material';
import { useState } from 'react';
import RecentOrders from './RecentOrders';

function User() {
  const [changeData, setChangeData] = useState<number>(0);

  return (
    <Box>
      <RecentOrders changeData={changeData} />
    </Box>
  );
}

export default User;
