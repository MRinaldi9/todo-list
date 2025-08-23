import { ulid } from '@std/ulid';
import { db } from '../database/index.ts';
import { LoginDTO, RegisterDTO } from '../DTO/auth.dto.ts';
import { AuthError } from '../errors/index.ts';

type UserKey = [string, string];

type AuthResponse = {
  userId: string;
  name: string;
  email: string;
};

export const registerUser = async (
  data: RegisterDTO,
): Promise<AuthResponse> => {
  if (await getUserByEmail(data.email)) {
    throw new AuthError('User already exists');
  }
  const ulidUser = ulid();
  const primaryKey = ['users', ulidUser];

  await db.getDb().set(primaryKey, data);
  await db.getDb().set(['userEmail', data.email], primaryKey);
  return { userId: ulidUser, name: data.name, email: data.email };
};

export const loginUser = async (
  data: LoginDTO,
): Promise<AuthResponse> => {
  const result = await getUserByEmail(data.email);
  if (!result || !result.user) {
    throw new AuthError('User or password is invalid');
  }
  const { primaryKey: [_, userId], user } = result;
  if (user.password !== data.password) {
    throw new AuthError('User or password is invalid');
  }
  return { userId, email: user.email, name: user.name };
};

const getUserByEmail = async (
  email: string,
): Promise<
  { user: RegisterDTO | null; primaryKey: UserKey } | null
> => {
  const { value: primaryKeyUser } = await db.getDb().get<UserKey>([
    'userEmail',
    email,
  ]);
  if (!primaryKeyUser) return null;
  const { value: userData } = await db.getDb().get<RegisterDTO>(primaryKeyUser);
  return { user: userData, primaryKey: primaryKeyUser };
};
