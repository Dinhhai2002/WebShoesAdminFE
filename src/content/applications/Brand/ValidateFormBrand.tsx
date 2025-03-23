import { object, string, TypeOf } from 'zod';

export const validateSchema = object({
  name: string()
    .trim()
    .nonempty('Tên thương hiệu không được trống')
    .max(32, 'Tên thương hiệu tối đa là 32 kí tự')
});

export type ValidateInput = TypeOf<typeof validateSchema>; 