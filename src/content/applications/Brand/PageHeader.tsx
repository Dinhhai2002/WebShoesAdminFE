import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useState, useRef, ChangeEvent, useEffect } from 'react'; // Added useRef, ChangeEvent, useEffect
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
    // Reset state when opening
    setSelectedFile(null);
    setPreviewUrl(null);
    reset(); // Reset form fields
  };

  const handleClose = () => {
    setOpen(false);
    // Optionally reset state on close as well, though reset on open is usually sufficient
    // setSelectedFile(null);
    // setPreviewUrl(null);
    // reset();
  };

  const methods = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });

  const { handleSubmit, reset } = methods;

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

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (values) => {
    setLoading(true);
    let createdBrandId: number | null = null;

    try {
      // Step 1: Create the brand first (without image URL)
      const createResponse = await brandApi.create({
        name: values.name,
        image_url: '' // Send empty string initially
      });
      createdBrandId = createResponse.data.id; // Get the ID of the newly created brand

      // Step 2: If an image was selected, upload it using the new ID
      if (selectedFile && createdBrandId) {
        try {
          await brandApi.uploadImage(createdBrandId, selectedFile);
          
        } catch (uploadError) {
          console.error(
            'Lỗi tải lên ảnh thương hiệu sau khi tạo:',
            uploadError
          );
          // Show a warning that creation succeeded but image upload failed
          toast.warning(
            `Thương hiệu '${values.name}' đã được tạo, nhưng tải lên ảnh thương hiệu thất bại: ${
              uploadError.response?.data?.message || uploadError.message
            }`
          );
        }
      }
      toast.success('Tạo mới thương hiệu thành công');
      setConfirmOpen(false)
      // Step 3: Close dialog, refresh data, reset form
      handleClose(); // Close the dialog
      setChangeData(!changeData); // Trigger data refresh in parent
      // No need to reset here as it's handled in handleClickOpen/handleClose
    } catch (createError) {
      console.error('Error creating brand:', createError);
      toast.error(
        createError.message || 'Failed to create brand.'
      );
    } finally {
      setConfirmOpen(false)
      setLoading(false);
    }
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

              {/* --- Image Section --- */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Ảnh thương hiệu (Tùy chọn)
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                {/* Display Preview or Placeholder */}
                <Box mb={1} sx={{ position: 'relative', width: 'fit-content' }}>
                  <img
                    src={previewUrl || '/static/images/placeholders/browse.svg'} // Show preview or placeholder
                    alt="Ảnh thương hiệu"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      display: 'block',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  {/* Remove Button for Preview */}
                  {previewUrl && (
                    <IconButton
                      size="small"
                      onClick={handleRemovePreview}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {/* Upload/Change Button */}
                <Button variant="outlined" onClick={triggerFileInput}>
                  {previewUrl ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                </Button>
              </Box>
              {/* --- End Image Section --- */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                {' '}
                {/* Use handleClose directly */}
                Hủy
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
                variant="contained"
                color="primary"
                style={{ display: 'none' }}
              >
                Thêm mới
              </LoadingButton>
            </DialogActions>
          </Box>
        </FormProvider>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Xác nhận tạo mới danh mục'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn tạo mới thương hiệu này này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit(onSubmitHandler)}
            color="primary"
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default PageHeader;
