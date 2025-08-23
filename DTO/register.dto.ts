import { email, InferOutput, object, pipe, string } from 'valibot';

export const RegisterSchema = object({
  name: string(),
  email: pipe(string(), email()),
  password: string(),
});

export type RegisterDTO = InferOutput<typeof RegisterSchema>;
