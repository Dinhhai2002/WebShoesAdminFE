import { object, string, number, TypeOf } from 'zod';

export const validateUserSchema = object({
  user_name: string()
    .trim()
    .nonempty('Tên đăng nhập không được để trống')
    .max(255, 'Tên đăng nhập không được phép lớn hơn 255 kí tự'),
  full_name: string()
    .trim()
    .nonempty('Họ tên không được để trống')
    .max(255, 'Họ tên không được phép lớn hơn 255 kí tự'),
  email: string()
    .trim()
    .nonempty('Email không được để trống')
    .email('Email chưa đúng định dạng')
    .max(255, 'Email không được phép lớn hơn 255 kí tự'),
  gender: number()
    .min(0, 'Giới tính nhỏ nhất 0')
    .max(1, 'Giới tính lớn nhất 1'),
  phone: string()
    .trim()
    .nonempty('Số điện thoại không được để trống')
    .regex(/^([0-9]{10})$/, 'Chỉ được phép nhập số và tối đa 10 số.'),
  password: string()
    .nonempty('Mật khẩu không được để trống')
    .min(8, 'Độ dài mật khẩu tối thiểu là 8')
    .max(20, 'Độ dài mật khẩu tối đa là 20')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt!'
    ),
  birthday: string()
    .trim()
    .nonempty('Ngày sinh không được để trống'),
  city_id: number()
    .min(1, 'Vui lòng nhập Tỉnh/Thành phố của nhà hàng'),
  district_id: number()
    .min(1, 'Vui lòng nhập Quận/Huyện của nhà hàng'),
  ward_id: number()
    .min(1, 'Vui lòng nhập Phường/Xã của nhà hàng'),
  full_address: string()
    .trim()
    .nonempty('Địa chỉ không được để trống')
    .max(255, 'Địa chỉ không được phép lớn hơn 255 kí tự'),
  role: number()
    .min(1, 'Vui lòng chọn vai trò'),
  ward_name : string(),
  district_name : string(),
  city_name : string(),
});

export type ValidateUserInput = TypeOf<typeof validateUserSchema>;
