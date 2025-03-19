import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select
} from '@mui/material';
import utils from 'src/utils/Utils';

function PaginationComponent({
  handleChangePagination,
  handleChangeLimit,
  totalRecord,
  limit
}: any) {
  return (
    <>
      <Box p={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Pagination
          count={utils.getTotalPage(totalRecord, limit)}
          variant="outlined"
          color="primary"
          onChange={handleChangePagination}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Số trang</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={limit}
            label="Số trang"
            onChange={handleChangeLimit}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}

export default PaginationComponent;
