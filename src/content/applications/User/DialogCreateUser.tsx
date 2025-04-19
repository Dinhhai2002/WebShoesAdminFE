import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthenticationApiService from 'src/services/API/AuthenticationApiService';
import { validateUserSchema, ValidateUserInput } from './validateUserSchema';
import { RoleEnum } from 'src/utils/enum/RoleEnum';

interface DialogCreateUserProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const roleOptions = [
  { value: RoleEnum.USER, label: 'Người dùng' },
  { value: RoleEnum.ADMIN, label: 'Quản trị viên' },
  { value: RoleEnum.STAFF, label: 'Nhân viên' },
];

const DialogCreateUser: React.FC<DialogCreateUserProps> = ({ open, onClose, onSuccess }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ValidateUserInput>({
    resolver: zodResolver(validateUserSchema),
    defaultValues: {
      user_name: '',
      password: '',
      email: '',
      full_name: '',
      gender: 0,
      phone: '',
      birthday: '',
      city_id: 0,
      district_id: 0,
      ward_id: 0,
      full_address: '',
      role: RoleEnum.USER,
    }
  });

  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      AuthenticationApiService.getAllCity().then(res => {
        setCities(res.data || []);
      });
      reset();
      setDistricts([]);
      setWards([]);
    }
  }, [open, reset]);

  const cityId = watch('city_id');
  useEffect(() => {
    if (cityId) {
      AuthenticationApiService.findDistrictByCityId(cityId).then(res => {
        setDistricts(res.data || []);
        setValue('district_id', 0);
        setWards([]);
        setValue('ward_id', 0);
      });
    } else {
      setDistricts([]);
      setValue('district_id', 0);
      setWards([]);
      setValue('ward_id', 0);
    }
  }, [cityId, setValue]);

  const districtId = watch('district_id');
  useEffect(() => {
    if (districtId) {
      AuthenticationApiService.findWardByDistrictId(districtId).then(res => {
        setWards(res.data || []);
        setValue('ward_id', 0);
      });
    } else {
      setWards([]);
      setValue('ward_id', 0);
    }
  }, [districtId, setValue]);

  const onSubmit = async (data: ValidateUserInput) => {
    setLoading(true);
    try {
      await AuthenticationApiService.register(data as any);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      // Error handled by toast in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tạo tài khoản mới</DialogTitle>
      <DialogContent sx={{ p: 2, mt: 2 }}>
        <form id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Tên đăng nhập"
                  fullWidth
                  {...register('user_name')}
                  error={!!errors.user_name}
                  helperText={errors.user_name?.message}
                />
                <TextField
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  label="Email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label="Họ và tên"
                  fullWidth
                  {...register('full_name')}
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                />
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    label="Giới tính"
                    value={watch('gender')}
                    {...register('gender')}
                    onChange={e => setValue('gender', Number(e.target.value))}
                  >
                    <MenuItem value={0}>Nam</MenuItem>
                    <MenuItem value={1}>Nữ</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
                <TextField
                  label="Ngày sinh"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register('birthday')}
                  error={!!errors.birthday}
                  helperText={errors.birthday?.message}
                />
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    label="Vai trò"
                    value={watch('role')}
                    {...register('role')}
                    onChange={e => setValue('role', Number(e.target.value))}
                  >
                    {roleOptions.map(role => (
                      <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                    ))}
                  </Select>
                  {errors.role && <span style={{color: 'red', fontSize: 12}}>{errors.role.message as string}</span>}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                  <Select
                    label="Tỉnh/Thành phố"
                    value={cityId}
                    {...register('city_id', { valueAsNumber: true })}
                    onChange={e => setValue('city_id', Number(e.target.value))}
                  >
                    <MenuItem value={0}>Chọn tỉnh/thành phố</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Quận/Huyện</InputLabel>
                  <Select
                    label="Quận/Huyện"
                    value={districtId}
                    {...register('district_id', { valueAsNumber: true })}
                    onChange={e => setValue('district_id', Number(e.target.value))}
                    disabled={!cityId}
                  >
                    <MenuItem value={0}>Chọn quận/huyện</MenuItem>
                    {districts.map(district => (
                      <MenuItem key={district.id} value={district.id}>{district.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Phường/Xã</InputLabel>
                  <Select
                    label="Phường/Xã"
                    value={watch('ward_id')}
                    {...register('ward_id', { valueAsNumber: true })}
                    onChange={e => setValue('ward_id', Number(e.target.value))}
                    disabled={!districtId}
                  >
                    <MenuItem value={0}>Chọn phường/xã</MenuItem>
                    {wards.map(ward => (
                      <MenuItem key={ward.id} value={ward.id}>{ward.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Địa chỉ chi tiết"
                  fullWidth
                  {...register('full_address')}
                  error={!!errors.full_address}
                  helperText={errors.full_address?.message}
                />
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Hủy</Button>
        <LoadingButton
          type="submit"
          form="create-user-form"
          variant="contained"
          loading={loading}
        >Tạo mới</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCreateUser;
