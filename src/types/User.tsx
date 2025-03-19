export interface User {
  id: number;
  user_name: string;
  full_name: string;
  email: string;
  avatar_id: number;
  avatar_url: string;
  phone: string;
  password: string;
  gender: number;
  birthday: string;
  ward_id: number;
  city_id: number;
  district_id: number;
  full_address: string;
  access_token: string;
  is_login: number;
  role: number;
  otp: number;
  otp_created_at: string;
  is_confirm_otp: number;
  is_active: number;
  is_google: number;
  point_promotion: number;
}
