import { TextField, TextFieldProps, Select, MenuItem, FormControl, InputLabel, SelectProps } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Option {
  value: number | string;
  label: string;
}

type IFormInputProps = {
  name: string;
  type: string;
  options?: Option[];
} & TextFieldProps;

const FormInput: FC<IFormInputProps> = ({
  name,
  defaultValue,
  type,
  label,
  options,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        type === 'select' ? (
          <FormControl fullWidth error={!!errors[name]}>
            <InputLabel>{label}</InputLabel>
            <Select
              {...field}
              label={label}
              {...(otherProps as SelectProps)}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[name] && (
              <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
                {errors[name].message}
              </div>
            )}
          </FormControl>
        ) : (
          <TextField
            {...otherProps}
            {...field}
            type={type}
            label={label}
            error={!!errors[name]}
            helperText={errors[name] ? errors[name].message : ''}
          />
        )
      )}
    />
  );
};

export default FormInput;
