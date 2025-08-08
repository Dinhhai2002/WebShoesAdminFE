import { FC, useState, useEffect } from 'react';
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack
} from '@mui/material';
import { ReturnRequestResponse } from 'src/services/API/ReturnRequestApi';
import { RETURN_STATUS_LABELS, ReturnStatus } from 'src/constants/ReturnRequestConstants';
import TableListReturnRequest from './TableListReturnRequest';

interface RecentReturnRequestsTableProps {
  listReturnRequests: ReturnRequestResponse[];
  totalRecord: number;
  loading: boolean;
  onRefresh: (params?: {
    user_id?: number;
    key_search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => void;
}

const RecentReturnRequestsTable: FC<RecentReturnRequestsTableProps> = ({
  listReturnRequests,
  totalRecord,
  loading,
  onRefresh
}) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<string>('');
  const [valueSearch, setValueSearch] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleRefresh();
  }, [page, limit, statusValue]);

  const handleRefresh = () => {
    onRefresh({
      page: page + 1,
      limit,
      status: statusValue,
      key_search: valueSearch
    });
  };

  const handlePageChange = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: any): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleStatusChange = (event: any): void => {
    setStatusValue(event.target.value);
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value;
    setValueSearch(newSearchValue);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setPage(0);
      onRefresh({
        page: 1,
        limit,
        status: statusValue,
        key_search: newSearchValue
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  return (
    <Card>
      <Box p={2}>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            size="small"
            label="Tìm kiếm"
            value={valueSearch}
            onChange={handleSearch}
            fullWidth
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusValue}
              label="Trạng thái"
              onChange={handleStatusChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Object.entries(RETURN_STATUS_LABELS).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <TableContainer>
        {loading ? (
          <Box display="flex" justifyContent="center" m={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableListReturnRequest
              listReturnRequests={listReturnRequests}
              onSuccess={handleRefresh}
            />
            <TablePagination
              component="div"
              count={totalRecord}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25, 30]}
            />
          </Table>
        )}
      </TableContainer>
    </Card>
  );
};

export default RecentReturnRequestsTable; 