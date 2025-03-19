import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextFieldProps
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type FormInputProps = {
  name: string;
  arr: Array<any>;
} & TextFieldProps;

export const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  label,
  arr,
  required,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <Box sx={{ marginTop: 2, marginBottom: 2, minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel required={required}>{label}</InputLabel>
        <Controller
          render={({ field: { onChange, value } }) => (
            <Select label={label} onChange={onChange} value={`${value}`}>
              {arr.length > 0 ? (
                arr.map((item: any) => (
                  <MenuItem key={item.id} value={`${item.id}`}>
                    {item.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={`0`}>Không có</MenuItem>
              )}
            </Select>
          )}
          control={control}
          name={name}
        />
        <FormHelperText error={!!errors[name]} id={`accountId-error-${name}`}>
          {errors[name] ? errors[name].message : ''}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
