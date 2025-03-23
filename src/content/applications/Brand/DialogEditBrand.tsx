import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import brandApi from 'src/services/API/BrandApi';
import { ValidateInput, validateSchema } from './ValidateFormBrand';

interface DialogEditBrandProps {
  id: number;
  openDialog: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

function DialogEditBrand({
  id,
  openDialog,
  handleClose,
  onSuccess
}: DialogEditBrandProps) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const methods = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });

  const {
    handleSubmit,
    reset,
    setValue
  } = methods;

  useEffect(() => {
    if (id) {
      brandApi
        .findOne(id)
        .then((response) => {
          setValue('name', response.data.name);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message);
        });
    }
  }, [id, setValue]);

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (values) => {
    setLoading(true);
    try {
      await brandApi.update(id, {
        name: values.name,
        image_url: ''
      });
      handleClose();
      toast.success('Cập nhật thương hiệu thành công!');
      onSuccess();
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
    setLoading(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Zoom}
      transitionDuration={600}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{ fontWeight: 600, fontSize: 20 }}
        id="responsive-dialog-title"
      >
        Chỉnh sửa thương hiệu
      </DialogTitle>

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          sx={{ mt: 1 }}
        >
          <DialogContent>
            <FormInput
              type="text"
              name="name"
              required
              fullWidth
              label="Tên thương hiệu"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                reset();
                handleClose();
              }}
              variant="outlined"
            >
              Hủy
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}

export default DialogEditBrand; 