import { email, InferOutput, object, pipe, string, transform } from 'valibot';
import { encodeBase64 } from '@std/encoding';

export const RegisterSchema = object({
  name: string(),
  email: pipe(string(), email()),
  password: pipe(string(), transform((password) => encodeBase64(password))),
});
export const LoginSchema = object({
  email: pipe(string(), email()),
  password: pipe(string(), transform((password) => encodeBase64(password))),
});

export type RegisterDTO = InferOutput<typeof RegisterSchema>;
export type LoginDTO = InferOutput<typeof LoginSchema>;
