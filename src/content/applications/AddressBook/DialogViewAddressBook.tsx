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
    Chip,
    Grid,
    Stack,
    Divider,
    Avatar,
    CircularProgress,
    alpha
  } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
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
        <DialogTitle sx={{ px: 3, py: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.background.paper, 0.2) }}>
              <HomeIcon />
            </Avatar>
            <Typography variant="h6">Chi tiết sổ địa chỉ</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {address ? (
            <Grid container spacing={3}>
              {/* Thông tin cơ bản */}
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{address.full_name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {address.phone}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={address.is_default ? 'Mặc định' : 'Không mặc định'}
                          color={address.is_default ? 'primary' : 'default'}
                          size="small"
                        />
                        <Chip
                          label={address.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                          color={address.status === 1 ? 'success' : 'error'}
                          size="small"
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Thông tin địa chỉ */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Thông tin địa chỉ
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Địa chỉ đầy đủ
                        </Typography>
                        <Typography variant="body1">
                          {address.full_address}
                        </Typography>
                      </Box>
                      <Divider />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Thành phố
                          </Typography>
                          <Typography variant="body1">
                            {address.city_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Quận/Huyện
                          </Typography>
                          <Typography variant="body1">
                            {address.district_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Phường/Xã
                          </Typography>
                          <Typography variant="body1">
                            {address.ward_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
          <Button onClick={onClose} variant="contained" color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default DialogViewAddressBook;
  