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
import materialApi from 'src/services/API/MaterialApi';
import FormInput from 'src/components/FormReact/FormInput';

interface DialogEditMaterialProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}

const materialSchema = z.object({
  name: z.string().min(1, 'Tên chất liệu không được để trống')
});

type MaterialFormData = z.infer<typeof materialSchema>;

function DialogEditMaterial({ open, onClose, id, onSuccess }: DialogEditMaterialProps) {
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

  useEffect(() => {
    if (open && id) {
      const fetchMaterial = async () => {
        try {
          setLoading(true);
          const response = await materialApi.findOne(id);
          const material = response.data;
          reset({
            name: material.name
          });
        } catch (error) {
          toast.error('Không thể tải thông tin chất liệu');
        } finally {
          setLoading(false);
        }
      };

      fetchMaterial();
    }
  }, [open, id, reset]);

  const onSubmitHandler: SubmitHandler<MaterialFormData> = async (data) => {
    try {
      setLoading(true);
      await materialApi.update(id, { name: data.name! });
      toast.success('Cập nhật chất liệu thành công!');
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
      <DialogTitle id="responsive-dialog-title">Chỉnh sửa chất liệu</DialogTitle>
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
          Cập nhật
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEditMaterial;