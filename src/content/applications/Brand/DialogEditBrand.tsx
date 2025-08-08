import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import brandApi, { Brand } from 'src/services/API/BrandApi';
import { ValidateInput, validateSchema } from './ValidateFormBrand';
import {
  DialogContentText,
  Slide
} from '@mui/material';

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
  const [brand, setBrand] = useState<Brand | null>(null); // State to hold brand data
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false); // Add confirmOpen state
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Fetch brand details when ID changes
  useEffect(() => {
    if (id && openDialog) {
      setLoading(true);
      brandApi
        .findOne(id)
        .then((response) => {
          setBrand(response.data);
          reset({ name: response.data.name });
        })
        .catch((error) => {
          console.error('Error fetching brand:', error);
          toast.error(
            error.response?.data?.message || 'Failed to load brand details.'
          );
          handleClose();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setBrand(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setConfirmOpen(false); // Also reset confirmOpen state
      reset({ name: '' });
    }
  }, [id, openDialog, reset]);

  // Effect for preview URL generation and cleanup
  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      }
    };
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (values: ValidateInput) => {
    setLoading(true);
    let nameOrImageUpdated = false;
    let finalBrandData = brand;

    const nameChanged = brand && brand.name !== values.name;

    // --- 1. Update Brand Name (if changed, preserving image URL if no new file) ---
    if (nameChanged && !selectedFile) {
      try {
        const updatePayload = {
          name: values.name,
          image_url: brand?.image_url || '' // Preserve existing image_url
        };
        const nameUpdateResponse = await brandApi.update(id, updatePayload);
        finalBrandData = nameUpdateResponse.data;
        nameOrImageUpdated = true;
      } catch (error) {
        console.error("Lỗi cập nhật tên thương hiệu:", error);
        toast.error(error.message || 'Lỗi cập nhật tên thương hiệu.');
        setLoading(false);
        return;
      }
    } else if (nameChanged && selectedFile) {
       // If name changed AND file selected, update name first (without image_url)
       // The image will be handled by uploadImage later
       try {
        const updatePayload = { name: values.name, image_url: brand?.image_url || '' }; // Still send old image url here? API might require it or handle it. Adjust if needed.
        const nameUpdateResponse = await brandApi.update(id, updatePayload);
        finalBrandData = nameUpdateResponse.data; // Temporarily update data
        nameOrImageUpdated = true; // Mark as updated because name changed
       } catch (error) {
        console.error("Lỗi cập nhật tên thương hiệu (trước khi tải lên ảnh):", error);
        toast.error(error.message || 'Lỗi cập nhật tên thương hiệu.');
        setLoading(false);
        return;
       }
    }

    // --- 2. Upload Image (if selected) ---
    if (selectedFile) {
      try {
        const imageUploadResponse = await brandApi.uploadImage(id, selectedFile);
        finalBrandData = imageUploadResponse.data; // Update with the latest data after image upload
        nameOrImageUpdated = true; // Mark as updated because image changed
      } catch (error) {
        console.error("Lỗi tải lên ảnh thương hiệu:", error);
        toast.error(error.response?.data?.message || 'Lỗi tải lên ảnh thương hiệu.');
        // Continue even if image upload fails, name might have been updated
      }
    }

    // --- 3. Final Steps ---
    setLoading(false);
    if (nameOrImageUpdated) {
      toast.success('Cập nhật thương hiệu thành công!');
      setConfirmOpen(false)
      onSuccess(); // Refresh data in the parent component
      handleClose(); // Close the dialog
    } else if (!nameChanged && !selectedFile) {
      setConfirmOpen(false)
      toast.info('Không có thay đổi nào được phát hiện.');
      handleClose();
    } else {
      setConfirmOpen(false)
       // Handles case where only image upload failed after successful name update
       onSuccess(); // Still refresh data as name might have changed
       handleClose();
    }
  };

  const handleCancel = () => {
    // Reset state before closing
    setBrand(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    reset({ name: '' });
    handleClose();
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

            {/* --- Image Section --- */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Ảnh thương hiệu
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <Box mb={1} sx={{ position: 'relative', width: 'fit-content' }}>
                <img
                  src={previewUrl || brand?.image_url || '/static/images/placeholders/browse.svg'}
                  alt={previewUrl ? "Preview" : "Current brand"}
                  style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {previewUrl && (
                  <IconButton
                    size="small"
                    onClick={handleRemovePreview}
                    sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Button variant="outlined" onClick={triggerFileInput}>
                {previewUrl ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
              </Button>
            </Box>
            {/* --- End Image Section --- */}

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined"> {/* Use handleCancel */}
              Hủy
            </Button>
            {/* <Button
                  variant="outlined"
                  autoFocus
                  onClick={() => setConfirmOpen(true)}
                >
                  Tạo mới
                </Button> */}
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={() => setConfirmOpen(true)}
            >
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </Box>
      </FormProvider>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận cập nhật thương hiệu"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn cập nhật thương hiệu này?
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
    </Dialog>
  );
}

export default DialogEditBrand;
