import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import addressBookApi from 'src/services/API/AddressBookApi';
  import authenticationApiService from 'src/services/API/AuthenticationApiService';
  import { toast } from 'react-toastify';
  
  interface DialogCreateAddressProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
  }
  
  function DialogCreateAddress({ open, onClose, onSuccess }: DialogCreateAddressProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const [formData, setFormData] = useState({
      full_name: '',
      phone: '',
      city_id: '',
      district_id: '',
      ward_id: '',
      full_address: ''
    });
  
    const [cities, setCities] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
  
    useEffect(() => {
      authenticationApiService.getAllCity().then((res) => setCities(res.data));
    }, []);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSelectChange = (e: any) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  
      if (name === 'city_id') {
        setFormData((prev) => ({ ...prev, district_id: '', ward_id: '' }));
        authenticationApiService.findDistrictByCityId(value).then((res) => setDistricts(res.data));
      }
      if (name === 'district_id') {
        setFormData((prev) => ({ ...prev, ward_id: '' }));
        authenticationApiService.findWardByDistrictId(value).then((res) => setWards(res.data));
      }
    };
  
    const handleSubmit = async () => {
      const city = cities.find((c) => c.id === Number(formData.city_id));
      const district = districts.find((d) => d.id === Number(formData.district_id));
      const ward = wards.find((w) => w.id === Number(formData.ward_id));
  
      if (!formData.full_name || !formData.phone || !formData.full_address || !ward || !district || !city) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }
  
      try {
        await addressBookApi.create({
          full_name: formData.full_name,
          phone: formData.phone,
          city_id: city.id,
          city_name: city.name,
          district_id: district.id,
          district_name: district.name,
          ward_id: ward.id,
          ward_name: ward.name,
          full_address: formData.full_address,
          is_default: 0
        });
        toast.success('Tạo địa chỉ thành công!');
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error('Không thể tạo địa chỉ.');
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo địa chỉ mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ tên"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
  
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tỉnh / Thành phố</InputLabel>
                <Select
                  name="city_id"
                  value={formData.city_id}
                  label="Tỉnh / Thành phố"
                  onChange={handleSelectChange}
                >
                  {cities.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Quận / Huyện</InputLabel>
                <Select
                  name="district_id"
                  value={formData.district_id}
                  label="Quận / Huyện"
                  onChange={handleSelectChange}
                  disabled={!formData.city_id}
                >
                  {districts.map((d) => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Phường / Xã</InputLabel>
                <Select
                  name="ward_id"
                  value={formData.ward_id}
                  label="Phường / Xã"
                  onChange={handleSelectChange}
                  disabled={!formData.district_id}
                >
                  {wards.map((w) => (
                    <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
  
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ chi tiết"
                name="full_address"
                value={formData.full_address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>Tạo</Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default DialogCreateAddress;
  