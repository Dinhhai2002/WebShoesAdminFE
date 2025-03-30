import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DialogCreateProductDetail from './DialogCreateProductDetail';
import { useState } from 'react';
import DialogCreateMultipleProductDetail from './DialogCreateMultipleProductDetail';

function PageHeader() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openCreateMultipleDialog, setOpenCreateMultipleDialog] = useState(false);  

  const handleClickOpenCreateMultipleDialog = () => {
    setOpenCreateMultipleDialog(true);
  };

  const handleCloseCreateMultipleDialog = () => {
    setOpenCreateMultipleDialog(false);
  };

  const handleClickOpenCreateDialog = () => { 
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  return (
    <Box 
      sx={{ 
        py: 3, 
        px: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}
    >
      <Typography variant="h4">Quản lý sản phẩm con</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpenCreateDialog}
      >
        Thêm sản phẩm con mới
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpenCreateMultipleDialog}
      >
        Thêm nhiều sản phẩm con
      </Button>

      <DialogCreateProductDetail
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
      />

      <DialogCreateMultipleProductDetail
        open={openCreateMultipleDialog}
        onClose={handleCloseCreateMultipleDialog}
      />
    </Box>
  );
}

export default PageHeader;