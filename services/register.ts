import { Handler } from '@std/http/unstable-route';
import { flatten } from 'valibot';
import { RegisterSchema } from '../DTO/register.dto.ts';
import { bodyParse } from '../utils/body-parse.ts';
import { JWT } from '@bepalo/jwt/mod.ts';

export const register: Handler = async (req) => {
  const key = JWT.genKey('ES256');
  console.log(key);

  const { issues, output: userData, success } = await bodyParse(
    req,
    RegisterSchema,
  );

  if (!success) {
    return new Response(
      JSON.stringify(flatten<typeof RegisterSchema>(issues)),
      {
        status: 400,
      },
    );
  }

  return new Response(
    JSON.stringify({ message: 'User registered successfully', user: userData }),
    { status: 201 },
  );
};
