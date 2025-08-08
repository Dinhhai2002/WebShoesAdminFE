import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete'; // Keep DeleteIcon
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, // Keep IconButton
  Slide,
  Stack, // Keep Stack
  Typography, // Keep Typography
  useMediaQuery,
  useTheme
} from '@mui/material';
// Removed duplicate imports and unused Input
import {
  ChangeEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from 'src/components/FormReact/FormInput';
import { ValidateInput, validateSchema } from './ValidateFormEdit';
import { EditSuccess } from 'src/utils/MessageToast';
// Import Category type from the API file
import categoryApi, { Category } from 'src/services/API/CategoryApi';
import CategoryContext from './RecentOrdersTable';

// Remove local CategoryItem interface

interface DialogEditProps {
  openDialogMapEdit: { [key: number]: boolean };
  id: number;
  handleCloseEdit: (id: number) => void;
  // Use the imported Category type for the item prop
  item: Category | null;
}

function DialogEdit({
  openDialogMapEdit,
  id,
  handleCloseEdit,
  item
}: DialogEditProps) {
  // Use the imported Category type for state type safety
  const [category, setCategory] = useState<Category | null>(item);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Using context to fetch data after successful edit
  const categoryContext = useContext(CategoryContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch category details if not provided via props or if ID changes
  useLayoutEffect(() => {
    // Only fetch if item is not provided or id doesn't match item's id
    if (id && (!item || item.id !== id)) {
      categoryApi
        .findOne(id)
        .then((response) => {
          // API returns { status, message, data: Category }, so access response.data
          setCategory(response.data);
        })
        .catch((error) => {
          console.error('Error fetching category:', error);
          toast.error('Failed to load category details.');
        });
    } // <-- Add missing closing brace for the 'if' statement
  }, [id, item]); // Add id and item as dependencies

  const methods = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });
  const {
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    setValue // Add setValue to potentially update form value if needed later
  } = methods;

  // Effect to set initial form value when category data loads
  useEffect(() => {
    if (category?.name) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  // Effect for preview URL generation and cleanup
  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null); // Clear preview if no file selected
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null); // Ensure cleanup on unmount or file change
      }
    };
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null); // Clear if no file selected
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    // Reset file input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmitHandler: SubmitHandler<ValidateInput> = async (
    values: ValidateInput
  ) => {
    setLoading(true);
    let nameUpdated = false;
    let imageUploaded = false;
    let finalCategoryData = category; // Store the latest category data

    // --- 1. Update Category Name (if changed) ---
    // --- 1. Update Category Name and potentially preserve existing image URL ---
    // Ensure category exists before comparing name
    const nameChanged = category && category.name !== values.name;

    if (nameChanged) {
      try {
        // Construct payload for update
        const updatePayload: Partial<Category> = { name: values.name };

        // If name changed BUT no new file is selected, include the existing image_url
        if (!selectedFile && category.image_url) {
          updatePayload.image_url = category.image_url;
        }

        const nameUpdateResponse = await categoryApi.update(id, updatePayload);
        // API returns { status, message, data: Category }, so access response.data
        finalCategoryData = nameUpdateResponse.data; // Update local state with response data
        nameUpdated = true; // Mark name as updated (or data potentially refreshed)
        
      } catch (error) {
        console.error('Error updating category name:', error);
        toast.error('Failed to update category name.');
        setLoading(false);
        return; // Stop if name update fails
      }
    }

    // --- 2. Upload Image (if selected) ---
    // --- 2. Upload Image (if selected) ---
    if (selectedFile) {
      try {
        const imageUploadResponse = await categoryApi.uploadImage(
          id,
          selectedFile
        );
        // API returns { status, message, data: Category }, so access response.data
        finalCategoryData = imageUploadResponse.data; // Update local state with response data
        imageUploaded = true;
      } catch (error) {
        console.error('Error uploading category image:', error);
        toast.error('Failed to upload category image.');
        // Decide if we should proceed if only image upload fails (name might have succeeded)
        // For now, we'll still close the dialog if name update was successful or no name change occurred
      }
    }

    // --- 3. Final Steps ---
    setLoading(false);
    if (nameUpdated || imageUploaded) {
      toast.success('Cập nhật danh mục thành công');
      setCategory(finalCategoryData); // Update state with the final data
      categoryContext.onChangeValue(); // Refresh the table
      setConfirmOpen(false);
      handleCloseEdit(id); // Close the dialog
      // No need for separate EditSuccess toast if specific toasts were shown
    } else if (!nameUpdated && !selectedFile) {
      // Nothing changed
      toast.info('No changes detected.');
      setConfirmOpen(false);
      handleCloseEdit(id); // Still close the dialog
    } else {
      setConfirmOpen(false);
      handleCloseEdit(id); // Close dialog even if only image upload failed after name update
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
        id="responsive-dialog-title" // Add id back if needed
      >
        Chỉnh sửa danh mục
      </DialogTitle>
      {/* Add FormProvider and Box form wrapper here */}
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          autoComplete="off"
          noValidate
          sx={{ mt: 1 }}
        >
          <DialogContent>
            {/* Input for Category Name */}
            <FormInput
              type="text"
              name="name"
              // Use defaultValue from react-hook-form's reset effect
              // defaultValue={category?.name || ''}
              required
              fullWidth
              label="Tên danh mục"
              sx={{ mb: 2 }}
            />

            {/* --- Image Section --- */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Ảnh danh mục
              </Typography>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />

              {/* Current Image or Preview */}
              <Box mb={1} sx={{ position: 'relative', width: 'fit-content' }}>
                <img
                  src={
                    previewUrl ||
                    category?.image_url ||
                    '/static/images/placeholders/browse.svg'
                  } // Show preview, then current, then placeholder
                  alt={previewUrl ? 'Preview' : 'Current category'}
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

              {/* Upload Button */}
              <Button variant="outlined" onClick={triggerFileInput}>
                {previewUrl ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
              </Button>
            </Box>
            {/* --- End Image Section --- */}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => {
                reset(); // Reset form
                setSelectedFile(null); // Clear selected file on cancel
                handleCloseEdit(id);
              }}
              variant="outlined"
            >
              Hủy bỏ
            </Button>
            <Button
              variant="outlined"
              autoFocus
              onClick={() => setConfirmOpen(true)}
            >
              cập nhật
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              autoFocus
              variant="outlined"
              style={{ display: 'none' }}
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
        <DialogTitle id="alert-dialog-title">
          {'cập nhật danh mục'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            xác nhận cập nhật danh mục này?
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
    </Dialog>
  );
}

export default DialogEdit;
