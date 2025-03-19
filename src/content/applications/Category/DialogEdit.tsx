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
import { ValidateInput, validateSchema } from './ValidateFormEdit';
import { EditSuccess } from 'src/utils/MessageToast';
import categoryApi from 'src/services/API/CategoryApi';
import CategoryContext from './RecentOrdersTable';

function DialogEdit({ openDialogMapEdit, id, handleCloseEdit, item }) {
  const [category, setCategory] = useState<any>(item);
  const [loading, setLoading] = useState(false);

  // Using context to fetch data after successful edit
  const categoryContext = useContext(CategoryContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useLayoutEffect(() => {
    categoryApi.findOne(id)
      .then((response) => {
        setCategory(response.data);
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
    if (category.name === values.name) {
      setLoading(false);
      return;
    }

    try {
      const response = await categoryApi.update(id, {
        name: values.name
      });
      setCategory(response.data);
      toast.success(EditSuccess);
      handleCloseEdit(id);
      setLoading(false);
      categoryContext.onChangeValue();
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
        Chỉnh sửa danh mục
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
              defaultValue={category.name}
              required
              fullWidth
              label="Category Name"
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
                Hủy bỏ
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              autoFocus
              variant="outlined"
            >
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}

export default DialogEdit;
