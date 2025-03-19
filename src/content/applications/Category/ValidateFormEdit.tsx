import { object, string, TypeOf } from 'zod';

export const validateSchema = object({
  name: string()
    .trim()
    .nonempty('Tên danh mục không được trống')
    .max(32, 'Tên danh mục tối đa là 32 kí tự'),
  // description: string().trim().nonempty('Mô tả không được trống')
  // .max(255, 'Tên người dùng tối đa là 32 kí tự')
});

export type ValidateInput = TypeOf<typeof validateSchema>;
