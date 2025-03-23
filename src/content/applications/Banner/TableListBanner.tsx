import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Chip
} from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

interface TableListBannerProps {
  listBanner: any[];
  labelTable: any[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
}

function TableListBanner({
  listBanner,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus
}: TableListBannerProps) {
  const getStatusColor = (status: number) => {
    return status === 1 ? '#2e7d32' : '#d32f2f';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Hoạt động' : 'Tạm khóa';
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Hình ảnh</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listBanner.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>{banner.id}</TableCell>
              <TableCell>
                <Box
                  component="img"
                  src={banner.url}
                  alt="Banner"
                  sx={{
                    width: 150,
                    height: 75,
                    objectFit: 'cover',
                    borderRadius: 1,
                    boxShadow: 1,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusText(banner.status)}
                  sx={{
                    backgroundColor: getStatusColor(banner.status),
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title={banner.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                  <IconButton
                    sx={{ 
                      fontSize: 40,
                      '& .MuiSvgIcon-root': {
                        fontSize: 40
                      }
                    }}
                    color={banner.status === 1 ? 'success' : 'error'}
                    onClick={() => handleClickOpenStatus(banner.id, banner.status)}
                  >
                    {banner.status === 1 ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableListBanner; 