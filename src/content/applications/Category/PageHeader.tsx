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
  useTheme,
  DialogContentText
} from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});
import categoryApi from 'src/services/API/CategoryApi';
import { CreateSuccess } from 'src/utils/MessageToast';
import { ValidateInput, validateSchema } from './ValidateFormEdit';
import { Alert, AlertTitle } from '@mui/material';

function PageHeader({ setChangeData, changeData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit
  } = methods;

  const onSubmitHandler: SubmitHandler<ValidateInput> = (values: any) => {
    setLoading(true);

    categoryApi
      .create({
        name: values.name,
        image_url: '',
        parent_id: 0,
        status: 1,
      })
      .then((response) => {
        if (response.status === 200) {
          if (image) {
            categoryApi
              .uploadImage(response.data.id, image)
              .then(() => {
                setOpen(false);
                toast.success(CreateSuccess);
                setChangeData(!changeData);
                reset();
                setConfirmOpen(false)
              })
              .catch((error) => {
                setLoading(false);
                toast.error(
                  error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên'
                );
              });
          } else {
            setOpen(false);
            toast.success(CreateSuccess);
            setChangeData(!changeData);
            reset();
            setConfirmOpen(false)
          }
        } else {
          toast.error(response.message || 'Có lỗi xảy ra');
        }
        setLoading(false);
        setConfirmOpen(false)
      })
      .catch((error) => {
        setLoading(false);
        setConfirmOpen(false)
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      });
  };

  return (
    <Grid maxWidth="xl" container justifyContent="space-between" alignItems="center">
      <Grid item></Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={handleClickOpen}
        >
          Thêm mới danh mục
        </Button>
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={600}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: 20 }}
          id="responsive-dialog-title"
        >
          Thêm mới danh mục
        </DialogTitle>

        <FormProvider {...methods}>
          <DialogContent>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmitHandler)}
              noValidate
              sx={{ mt: 1 }}
            >
              <FormInput
                type="text"
                name="name"
                defaultValue={''}
                required
                fullWidth
                label="Tên danh mục"
                sx={{ mb: 2 }}
              />
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e: any) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button variant="contained" component="span">
                  Tải ảnh lên
                </Button>
              </label>
              {preview && (
                <Box mt={2} textAlign="center">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
              <DialogActions>
                <Button variant="outlined" autoFocus onClick={handleClose}>
                  Thoát
                </Button>
                <Button
                  variant="outlined"
                  autoFocus
                  onClick={() => setConfirmOpen(true)}
                >
                  Tạo mới
                </Button>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  autoFocus
                  variant="outlined"
                  style={{ display: 'none' }}
                >
                  Tạo mới
                </LoadingButton>
              </DialogActions>
            </Box>
          </DialogContent>
        </FormProvider>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận tạo mới danh mục"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn tạo mới danh mục này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit(onSubmitHandler)} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default PageHeader;
