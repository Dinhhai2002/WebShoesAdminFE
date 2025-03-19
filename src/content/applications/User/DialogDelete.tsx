import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme,
    Zoom
  } from '@mui/material';
  
  function DialogDelete({
    openDialogMapDelete,
    id,
    handleCloseDelete,
    handleChangeStatusUser
  }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openDialogMapDelete[id] || false}
        onClose={() => {
          handleCloseDelete(id);
        }}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Zoom}
        transitionDuration={600}
      >
        <DialogTitle id="responsive-dialog-title">
          Confirm change user status?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this user's status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCloseDelete(id);
            }}
            variant="outlined"
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleChangeStatusUser(id);
            }}
            autoFocus
            variant="outlined"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default DialogDelete;