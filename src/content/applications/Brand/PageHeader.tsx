import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import brandApi from 'src/services/API/BrandApi';
import { CreateSuccess } from 'src/utils/MessageToast';
import { ValidateInput, validateSchema } from './ValidateFormBrand';

interface PageHeaderProps {
  setChangeData: (value: boolean) => void;
  changeData: boolean;
}

function PageHeader({ setChangeData, changeData }: PageHeaderProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const methods = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });

  const {
    handleSubmit,
    reset
  } = methods;

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (values) => {
    setLoading(true);
    try {
      await brandApi.create({
        name: values.name,
        image_url: ''
      });
      setOpen(false);
      toast.success(CreateSuccess);
      setChangeData(!changeData);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
    setLoading(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <h2>Quản lý thương hiệu</h2>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={handleClickOpen}
        >
          Thêm thương hiệu
        </Button>
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Slide}
        transitionDuration={600}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: 20 }}
          id="responsive-dialog-title"
        >
          Thêm thương hiệu mới
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
                Thêm mới
              </LoadingButton>
            </DialogActions>
          </Box>
        </FormProvider>
      </Dialog>
    </Grid>
  );
}

export default PageHeader; 