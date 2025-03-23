import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // bạn đang dùng dayjs trong code

function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ToastContainer />
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
