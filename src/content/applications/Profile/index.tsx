import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { toast } from 'react-toastify';
import userApiService, { UpdateUserRequest, UserResponse } from 'src/services/API/UserApiService';
  
  function ProfileManagement() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [formData, setFormData] = useState<UpdateUserRequest>({
      full_name: '',
      email: '',
      phone: '',
      full_address: ''
    });
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
    useEffect(() => {
      userApiService.getUser().then((res) => {
        setUser(res.data);
        setFormData({
          full_name: res.data.full_name,
          email: res.data.email,
          phone: res.data.phone,
          full_address: res.data.full_address
        });
        setAvatarPreview(res.data.avatar_url);
      });
    }, []);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    };
  
    const handleSave = async () => {
      try {
        if (avatarFile) {
          const avatarResponse = await userApiService.uploadAvatar(avatarFile);
          toast.success('Cập nhật ảnh đại diện thành công!');
        }
        await userApiService.update(formData);
        toast.success('Cập nhật thông tin thành công!');
      } catch (error) {
        toast.error('Cập nhật thất bại.');
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Thông tin cá nhân
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Avatar
                src={avatarPreview}
                sx={{ width: 100, height: 100, mx: 'auto' }}
              />
              <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                Tải ảnh lên
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
              </Button>
            </Grid>
  
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="full_address"
                value={formData.full_address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={handleSave}>
                Lưu thay đổi
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
  
  export default ProfileManagement;
  