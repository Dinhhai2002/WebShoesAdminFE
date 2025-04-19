import { Box, Button } from '@mui/material';
import { useState } from 'react';
import RecentOrders from './RecentOrders';
import DialogCreateUser from './DialogCreateUser';

function User() {
  const [changeData, setChangeData] = useState<number>(0);
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)} sx={{ ml: 2, mt: 2, mb: 2 }}>
        Thêm người dùng
      </Button>
      <DialogCreateUser
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setChangeData((prev) => prev + 1);
          setOpenCreate(false);
        }}
      />
      <RecentOrders changeData={changeData} />
    </Box>
  );
}

export default User;
