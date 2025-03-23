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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import colorApi from 'src/services/API/ColorApi';
import FormInput from 'src/components/FormReact/FormInput';

interface DialogEditColorProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}

const colorSchema = z.object({
  name: z.string().min(1, 'Tên màu không được để trống')
});

type ColorFormData = z.infer<typeof colorSchema>;

function DialogEditColor({ open, onClose, id, onSuccess }: DialogEditColorProps) {
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

  useEffect(() => {
    if (open && id) {
      const fetchColor = async () => {
        try {
          setLoading(true);
          const response = await colorApi.findOne(id);
          const color = response.data;
          reset({
            name: color.name
          });
        } catch (error) {
          toast.error('Không thể tải thông tin màu');
        } finally {
          setLoading(false);
        }
      };

      fetchColor();
    }
  }, [open, id, reset]);

  const onSubmitHandler: SubmitHandler<ColorFormData> = async (data) => {
    try {
      setLoading(true);
      await colorApi.update(id, { name: data.name! });
      toast.success('Cập nhật màu thành công!');
      onSuccess();
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
      <DialogTitle id="responsive-dialog-title">Chỉnh sửa màu</DialogTitle>
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
          Cập nhật
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEditColor;