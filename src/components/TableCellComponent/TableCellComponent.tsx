import { TableCell, Typography } from '@mui/material';

function TableCellComponent({ position = 'center', value }: any) {
  return (
    <TableCell align={position}>
      <Typography
        variant="body1"
        fontWeight="bold"
        color="text.primary"
        gutterBottom
      >
        {value}
      </Typography>
    </TableCell>
  );
}

export default TableCellComponent;
