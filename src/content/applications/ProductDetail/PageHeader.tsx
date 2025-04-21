import { Box, Button, Container, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DialogCreateProductDetail from './DialogCreateProductDetail';
import { useState } from 'react';
import DialogCreateMultipleProductDetail from './DialogCreateMultipleProductDetail';

function PageHeader({ onRefresh }: { onRefresh?: () => void }) {
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
    <Container maxWidth="xl">
      <Box sx={{ py: 3, px: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h2">
            Quản lý sản phẩm chi tiết sản phẩm
            </Typography>
          </Grid>
          <Grid item>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={handleClickOpenCreateDialog}
              sx={{
                px: 3,
                py: 1
              }}
            >
              Thêm sản phẩm mới
            </Button>
            <Button
             variant="contained"
             startIcon={<AddIcon />}
             onClick={handleClickOpenCreateMultipleDialog}
              sx={{
                ml: 1,
                px: 3,
                py: 1
              }}
            >
              Thêm danh sách sản phẩm
            </Button>
          </Grid>
        </Grid>
      </Box>
      <DialogCreateProductDetail
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
      />

      <DialogCreateMultipleProductDetail
        open={openCreateMultipleDialog}
        onClose={handleCloseCreateMultipleDialog}
        onSuccess={onRefresh}
      />
    </Container>
  );
}

export default PageHeader;