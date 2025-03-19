import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { Grid, Paper, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ValidateInput, validateSchema } from './ValidateFormForgotPassword';
import InputText from 'src/components/InputText/InputText';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { theme } from 'src/components/CustomMui/CustomMui';

const cx = classNames.bind(styles);

export default function ForgotPassword() {
  // const navigate = useNavigate();

  // const [loading, setLoading] = useState(false);

  // // validate
  // const {
  //   register,
  //   formState: { errors, isSubmitSuccessful },
  //   reset,
  //   handleSubmit
  // } = useForm<ValidateInput>({
  //   resolver: zodResolver(validateSchema)
  // });

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [isSubmitSuccessful]);

  // const onSubmitHandler: SubmitHandler<ValidateInput> = (values: any) => {
  //   setLoading(true);
  //   authenticationApiService
  //     .OtpForgot(values.name, values.email)
  //     .then((data: any) => {
  //       localStorage.setItem('username', values.name);
  //       localStorage.setItem('email', values.email);
  //       localStorage.setItem('typeOtp', '1');
  //       navigate('/otp');
  //     })
  //     .catch((error: any) => {
  //       setLoading(false);
  //       toast.error(`${error.message}`);
  //     });
  // };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          className={cx('body')}
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: Logo,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'contain',
            backgroundPosition: 'center'
          }}
        ></Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Link to={'/'}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Link>
            <Typography component="h1" variant="h5">
              Quên mật khẩu
            </Typography>
            {/* <Box
              component="form"
              onSubmit={handleSubmit(onSubmitHandler)}
              autoComplete="off"
              noValidate
              sx={{ mt: 1 }}
            >
              <InputText
                errors={errors}
                register={register}
                autoFocus={true}
                name="name"
                label="Tên người dùng"
              />
              <InputText
                errors={errors}
                register={register}
                name="email"
                label="Email"
              />

              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </LoadingButton>
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs>
                  <Link className={cx('link')} to={'/login'}>
                    Đã có tài khoản?Đăng nhập
                  </Link>
                </Grid>
              </Grid>
            </Box> */}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
