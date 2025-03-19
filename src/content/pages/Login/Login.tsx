import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from 'src/components/CustomMui/CustomMui';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.scss';
import { LoadingButton } from '@mui/lab';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ValidateInput, validateSchema } from './ValidateFormLogin';
import authenticationApiService from 'src/services/API/AuthenticationApiService';
import userApiService from 'src/services/API/UserApiService';

const cx = classNames.bind(styles);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // validate
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit
  } = useForm<ValidateInput>({
    resolver: zodResolver(validateSchema)
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<ValidateInput> = (values: any) => {
    setLoading(true);

    authenticationApiService
      .Login(values.name, values.password)
      .then((data: any) => {
        localStorage.setItem('token', data.data.token);
        userApiService.setToken(data.data.token);

        userApiService
          .getUser()
          .then((data: any) => {
            localStorage.setItem('user', JSON.stringify(data.data));
            if (data.data.role === 1) {
              window.location.href = '/';
            } else {
              toast.error(`Tài khoản không có quyền truy cập vào hệ thống!`);
              setLoading(false);
              return;
            }
          })
          .catch((error: any) => {
            setLoading(false);
          });
      })
      .catch((error: any) => {
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
          sx={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 400
            }}
          >
            <Link to={'/'}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Link>

            <Typography component="h3" variant="h5">
              Đăng Nhập
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmitHandler)}
              autoComplete="off"
              noValidate
              sx={{ mt: 1, width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Tên người dùng"
                autoComplete="username"
                autoFocus
                error={!!errors['name']}
                helperText={errors['name'] ? errors['name'].message : ''}
                {...register('name')}
              />

              <FormControl sx={{ marginTop: 2 }} fullWidth variant="outlined">
                <InputLabel required htmlFor="outlined-adornment-password">
                  Mật khẩu
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors['password']}
                  {...register('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {
                  <FormHelperText
                    error={!!errors['password']}
                    id="accountId-error"
                  >
                    {errors['password'] ? errors['password'].message : ''}
                  </FormHelperText>
                }
              </FormControl>

              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={loading}
                sx={{ mt: 4, mb: 4, padding: 1 }}
              >
                Đăng Nhập
              </LoadingButton>
            </Box>
            <Grid container>
              <Grid item xs>
                <Link className={cx('link')} to={'/forgot-password'}>
                  Quên mật khẩu?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
