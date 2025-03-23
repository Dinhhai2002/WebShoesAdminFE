import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DialogCreateColor from './DialogCreateColor';
import { useState } from 'react';

function PageHeader() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  return (
    <Box sx={{ py: 3, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4">Quản lý màu sắc</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpenCreateDialog}
      >
        Thêm màu mới
      </Button>

      <DialogCreateColor
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
      />
    </Box>
  );
}

export default PageHeader;