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
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';

interface DialogDeleteProps {
  openDialogMapDelete: { [key: number]: boolean };
  id: number;
  handleCloseDelete: (id: number) => void;
  handleChangeStatusOrder: (id: number, status: number) => void;
  status: number;
}

function DialogDelete({
  openDialogMapDelete,
  id,
  handleCloseDelete,
  handleChangeStatusOrder,
  status
}: DialogDeleteProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getConfirmMessage = () => {
    return status === StatusOrderEnum.PENDING
      ? 'Are you sure you want to confirm this order?'
      : 'Are you sure you want to cancel this order?';
  };

  const getNewStatus = () => {
    return status === StatusOrderEnum.PENDING
      ? StatusOrderEnum.CONFIRMED
      : StatusOrderEnum.CANCELLED;
  };

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
        Confirm order status change?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getConfirmMessage()}
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
            handleChangeStatusOrder(id, getNewStatus());
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