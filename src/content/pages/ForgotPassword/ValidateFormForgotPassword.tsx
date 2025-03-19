import { object, string, TypeOf } from "zod";

export const validateSchema = object({
  name: string()
    .nonempty("Tên người dùng không được trống")
    .max(32, "Tên người dùng tối đa là 32 kí tự"),
  email: string().nonempty("Email là bắt buộc").email("Email không hợp lệ"),
});

export type ValidateInput = TypeOf<typeof validateSchema>;
