import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DialogCreateMaterial from './DialogCreateMaterial';
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
    <Box 
      sx={{ 
        py: 3, 
        px: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}
    >
      <Typography variant="h4">Quản lý chất liệu</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpenCreateDialog}
      >
        Thêm chất liệu mới
      </Button>

      <DialogCreateMaterial
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
      />
    </Box>
  );
}

export default PageHeader;