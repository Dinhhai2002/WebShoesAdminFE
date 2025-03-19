import { TableCell } from '@mui/material';
import {
  IconActionEnum,
  IconActionTitleEnum
} from 'src/utils/enum/IconActionEnum';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import IconActions from './IconActions';

interface ActionProps {
  handleClickOpenEdit: () => {};
  id: number;
  handleClickOpenDelete: () => {};
  status: number;
}
function ActionComponent({
  handleClickOpenEdit,
  id,
  handleClickOpenDelete,
  status
}: ActionProps) {
  return (
    <TableCell align="center">
      <IconActions
        title={IconActionTitleEnum.EDIT}
        handleClickOpen={handleClickOpenEdit}
        id={id}
        type={IconActionEnum.EDIT}
      />
      {status === StatusEnum.ON ? (
        <IconActions
          title={IconActionTitleEnum.DELETE}
          handleClickOpen={handleClickOpenDelete}
          id={id}
          type={IconActionEnum.DELETE}
        />
      ) : (
        <IconActions
          title={IconActionTitleEnum.OPEN}
          handleClickOpen={handleClickOpenDelete}
          id={id}
          type={IconActionEnum.OPEN}
        />
      )}
    </TableCell>
  );
}

export default ActionComponent;
