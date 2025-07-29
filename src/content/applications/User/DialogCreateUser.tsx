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
import AuthenticationApiService from '../../../services/API/AuthenticationApiService';
import { validateUserSchema, ValidateUserInput } from './validateUserSchema';
import { RoleEnum } from 'src/utils/enum/RoleEnum';

interface DialogCreateUserProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface GHNProvince {
  ProvinceID: number;
  ProvinceName: string;
}

interface GHNDistrict {
  DistrictID: number;
  DistrictName: string;
}

interface GHNWard {
  WardCode: string;
  WardName: string;
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
      ward_name: '',
      district_name: '',
      city_name: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<GHNProvince[]>([]);
  const [districts, setDistricts] = useState<GHNDistrict[]>([]);
  const [wards, setWards] = useState<GHNWard[]>([]);

  // Load tỉnh/thành phố khi mở dialog
  useEffect(() => {
    if (open) {
      loadProvinces();
      reset();
      setDistricts([]);
      setWards([]);
    }
  }, [open, reset]);

  // Load danh sách tỉnh/thành phố
  const loadProvinces = async () => {
    try {
      const response = await AuthenticationApiService.getGHNProvinces();
      setProvinces(response.data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  // Xử lý khi chọn tỉnh/thành phố
  const cityId = watch('city_id');
  useEffect(() => {
    if (cityId) {
      const selectedProvince = provinces.find(p => p.ProvinceID === cityId);
      if (selectedProvince) {
        setValue('city_name', selectedProvince.ProvinceName, { shouldValidate: true });
        loadDistricts(cityId);
      }
      setValue('district_id', 0, { shouldValidate: true });
      setValue('district_name', '', { shouldValidate: true });
      setValue('ward_id', 0, { shouldValidate: true });
      setValue('ward_name', '', { shouldValidate: true });
      setDistricts([]);
      setWards([]);
    }
  }, [cityId, provinces, setValue]);

  // Load danh sách quận/huyện
  const loadDistricts = async (provinceId: number) => {
    try {
      const response = await AuthenticationApiService.getGHNDistricts(provinceId);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  // Xử lý khi chọn quận/huyện
  const districtId = watch('district_id');
  useEffect(() => {
    if (districtId) {
      const selectedDistrict = districts.find(d => d.DistrictID === districtId);
      if (selectedDistrict) {
        setValue('district_name', selectedDistrict.DistrictName, { shouldValidate: true });
        loadWards(districtId);
      }
      setValue('ward_id', 0, { shouldValidate: true });
      setValue('ward_name', '', { shouldValidate: true });
      setWards([]);
    }
  }, [districtId, districts, setValue]);

  // Load danh sách phường/xã
  const loadWards = async (districtId: number) => {
    try {
      const response = await AuthenticationApiService.getGHNWards(districtId);
      setWards(response.data);
    } catch (error) {
      console.error('Error loading wards:', error);
    }
  };

  // Xử lý khi chọn phường/xã
  const wardId = watch('ward_id');
  useEffect(() => {
    if (wardId && Number(wardId) !== 0) {
      const selectedWard = wards.find(w => w.WardCode === `${wardId}`);
      if (selectedWard) {
        setValue('ward_name', selectedWard.WardName, { shouldValidate: true });
      }
    }
  }, [wardId, wards, setValue]);

  const onSubmit = async (data: ValidateUserInput) => {
    setLoading(true);
    try {
      await AuthenticationApiService.Register(data as any);
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
                    {provinces.map(province => (
                      <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </MenuItem>
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
                      <MenuItem key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Phường/Xã</InputLabel>
                  <Select
                    label="Phường/Xã"
                    value={wardId || '0'}
                    {...register('ward_id')}
                    onChange={e => setValue('ward_id', Number(e.target.value), { shouldValidate: true })}
                    disabled={!districtId}
                  >
                    <MenuItem value="0">Chọn phường/xã</MenuItem>
                    {wards.map(ward => (
                      <MenuItem key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </MenuItem>
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
