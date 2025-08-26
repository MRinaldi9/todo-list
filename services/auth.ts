import { Handler } from '@std/http/unstable-route';
import { flatten } from 'valibot';
import { LoginSchema, RegisterSchema } from '../DTO/auth.dto.ts';
import { loginUser, registerUser } from '../repository/auth.repository.ts';
import { bodyParse } from '../utils/body-parse.ts';
import { tryCatch } from '../utils/try-catch.ts';
import { jwtService } from './jwt.ts';
import { STATUS_CODE } from '@std/http';

export const register: Handler = async (req) => {
  const { issues, output: userData, success } = await bodyParse(
    req,
    RegisterSchema,
  );

  if (!success) {
    return new Response(
      JSON.stringify(flatten<typeof RegisterSchema>(issues)),
      {
        status: STATUS_CODE.BadRequest,
      },
    );
  }

  const { error, data } = await tryCatch(registerUser(userData));
  if (error) {
    return Response.json(
      { message: error.message },
      { status: STATUS_CODE.Conflict },
    );
  }
  const token = jwtService.signToken({
    email: data.email,
    name: data.name,
    sub: data.userId,
  });

  return Response.json(
    { token },
    { status: STATUS_CODE.Created },
  );
};

export const login: Handler = async (req) => {
  const { issues, output: loginData, success } = await bodyParse(
    req,
    LoginSchema,
  );

  if (!success) {
    return new Response(
      JSON.stringify(flatten<typeof LoginSchema>(issues)),
      {
        status: STATUS_CODE.BadRequest,
      },
    );
  }

  const { error, data } = await tryCatch(loginUser(loginData));
  if (error) {
    return Response.json(
      { message: error.message },
      { status: STATUS_CODE.Unauthorized },
    );
  }

  const token = jwtService.signToken({
    email: data.email,
    name: data.name,
    sub: data.userId,
  });

  return Response.json(
    { token },
    { status: STATUS_CODE.OK },
  );
};
