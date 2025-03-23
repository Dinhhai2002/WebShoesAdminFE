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
import colorApi from 'src/services/API/ColorApi';
import FormInput from 'src/components/FormReact/FormInput';

interface DialogCreateColorProps {
  open: boolean;
  onClose: () => void;
}

const colorSchema = z.object({
  name: z.string().min(1, 'Tên màu không được để trống')
});

type ColorFormData = z.infer<typeof colorSchema>;

function DialogCreateColor({ open, onClose }: DialogCreateColorProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const methods = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: ''
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmitHandler: SubmitHandler<ColorFormData> = async (data) => {
    try {
      setLoading(true);
      await colorApi.create({ name: data.name });
      toast.success('Thêm màu mới thành công!');
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
      <DialogTitle id="responsive-dialog-title">Thêm màu mới</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput
              name="name"
              label="Tên màu"
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

export default DialogCreateColor;