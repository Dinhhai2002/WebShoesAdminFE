import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useContext, useLayoutEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import UserContext from './RecentOrdersTable';
import { ValidateInput, validateSchema } from './ValidateFormEdit';
import { EditSuccess } from 'src/utils/MessageToast';
import userApiService from 'src/services/API/UserApiService';

function DialogEdit({ openDialogMapEdit, id, handleCloseEdit, item }) {
  const [user, setUser] = useState<any>(item);
  const [loading, setLoading] = useState(false);

  const userContext = useContext(UserContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useLayoutEffect(() => {
    userApiService.getUser()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {});
  }, []);

  const methods = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });
  const {
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset
  } = methods;

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (values: any) => {
    setLoading(true);
    if (user.full_name === values.name) {
      setLoading(false);
      return;
    }

    try {
      const response = await userApiService.update({
        full_name: values.name,
        email: user.email,
        phone: user.phone,
        full_address: user.full_address
      });
      setUser(response.data);
      toast.success(EditSuccess);
      handleCloseEdit(id);
      setLoading(false);
      userContext.onChangeValue();
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialogMapEdit[id] || false}
      onClose={() => {
        handleCloseEdit(id);
      }}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Slide}
      transitionDuration={600}
    >
      <DialogTitle
        sx={{ fontWeight: 600, fontSize: 20 }}
        id="responsive-dialog-title"
      >
        User Details
      </DialogTitle>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          autoComplete="off"
          noValidate
          sx={{ mt: 1 }}
        >
          <DialogContent>
            <FormInput
              type="text"
              name="name"
              defaultValue={user.full_name}
              required
              fullWidth
              label="Full Name"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => {
                reset();
                handleCloseEdit(id);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              autoFocus
              variant="outlined"
            >
              Update
            </LoadingButton>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}

export default DialogEdit; 