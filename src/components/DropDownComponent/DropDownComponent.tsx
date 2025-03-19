import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function DropDownComponent({ value, handleStatusChange, label, arr, type }) {
  return (
    <Box width={150} sx={{ marginRight: 2 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={handleStatusChange}
          label={label}
          autoWidth
        >
          {arr.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
          {type !== 0 && <MenuItem value={-1}>Tất cả</MenuItem>}
        </Select>
      </FormControl>
    </Box>
  );
}

export default DropDownComponent;
