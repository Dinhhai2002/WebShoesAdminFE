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
import sizeApi from 'src/services/API/SizeApi';
import FormInput from 'src/components/FormReact/FormInput';

interface DialogEditSizeProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}

const sizeSchema = z.object({
  name: z.string().min(1, 'Tên size không được để trống')
});

type SizeFormData = z.infer<typeof sizeSchema>;

function DialogEditSize({ open, onClose, id, onSuccess }: DialogEditSizeProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const methods = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: ''
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (open && id) {
      const fetchSize = async () => {
        try {
          setLoading(true);
          const response = await sizeApi.findOne(id);
          const size = response.data;
          reset({
            name: size.name
          });
        } catch (error) {
          toast.error('Không thể tải thông tin size');
        } finally {
          setLoading(false);
        }
      };

      fetchSize();
    }
  }, [open, id, reset]);

  const onSubmitHandler: SubmitHandler<SizeFormData> = async (data) => {
    try {
      setLoading(true);
      await sizeApi.update(id, { name: data.name! });
      toast.success('Cập nhật size thành công!');
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
      <DialogTitle id="responsive-dialog-title">Chỉnh sửa size</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput
              name="name"
              label="Tên size"
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

export default DialogEditSize; 