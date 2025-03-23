import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    Zoom,
    Chip
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import addressBookApi, { AddressBook } from 'src/services/API/AddressBookApi';
  import { toast } from 'react-toastify';
  
  interface DialogViewAddressBookProps {
    open: boolean;
    onClose: () => void;
    id: number;
  }
  
  function DialogViewAddressBook({ open, onClose, id }: DialogViewAddressBookProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [address, setAddress] = useState<AddressBook | null>(null);
  
    useEffect(() => {
      const fetchDetail = async () => {
        try {
          const res = await addressBookApi.findOne(id);
          setAddress(res.data);
        } catch (error) {
          toast.error('Không thể tải chi tiết địa chỉ');
        }
      };
  
      if (open && id) {
        fetchDetail();
      }
    }, [open, id]);
  
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 500 }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết sổ địa chỉ</DialogTitle>
        <DialogContent>
          {address ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography><strong>Họ tên:</strong> {address.full_name}</Typography>
              <Typography><strong>SĐT:</strong> {address.phone}</Typography>
              <Typography><strong>Thành phố:</strong> {address.city_name}</Typography>
              <Typography><strong>Quận/Huyện:</strong> {address.district_name}</Typography>
              <Typography><strong>Phường/Xã:</strong> {address.ward_name}</Typography>
              <Typography><strong>Địa chỉ chi tiết:</strong> {address.full_address}</Typography>
              <Box>
                <Chip
                  label={address.is_default ? 'Mặc định' : 'Không mặc định'}
                  color={address.is_default ? 'primary' : 'default'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={address.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                  color={address.status === 1 ? 'success' : 'error'}
                />
              </Box>
            </Box>
          ) : (
            <Typography>Đang tải dữ liệu...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default DialogViewAddressBook;
  