import {
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
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import materialApi from 'src/services/API/MaterialApi';
import FormInput from 'src/components/FormReact/FormInput';

interface DialogCreateMaterialProps {
  open: boolean;
  onClose: () => void;
}

const materialSchema = z.object({
  name: z.string().min(1, 'Tên chất liệu không được để trống')
});

type MaterialFormData = z.infer<typeof materialSchema>;

function DialogCreateMaterial({ open, onClose }: DialogCreateMaterialProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const methods = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: ''
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmitHandler: SubmitHandler<MaterialFormData> = async (data) => {
    try {
      setLoading(true);
      await materialApi.create({ name: data.name });
      toast.success('Thêm chất liệu mới thành công!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 500 }}
      aria-labelledby="responsive-dialog-title"
      aria-describedby="responsive-dialog-description"
    >
      <DialogTitle id="responsive-dialog-title">Thêm chất liệu mới</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput
              name="name"
              label="Tên chất liệu"
              type="text"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy
        </Button>
        <LoadingButton
          color="primary"
          onClick={handleSubmit(onSubmitHandler)}
          loading={loading}
          variant="contained"
        >
          Thêm mới
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCreateMaterial;