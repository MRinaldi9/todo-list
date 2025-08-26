import { db } from '../database/index.ts';
import { LoginDTO, RegisterDTO } from '../DTO/auth.dto.ts';
import { AuthError } from '../errors/index.ts';
import { authKeys } from '../queries-key/index.ts';
import { generateUlid, ULID } from '../utils/ulid.ts';

type UserKey = ReturnType<typeof authKeys.user>;

type AuthResponse = {
  userId: ULID;
  name: string;
  email: string;
};

export const registerUser = async (
  data: RegisterDTO,
): Promise<AuthResponse> => {
  const ulidUser = generateUlid();
  const primaryKey = authKeys.user(ulidUser);
  const emailKey = authKeys.userEmail(data.email);

  const transaction = db.atomic().check({ key: emailKey, versionstamp: null })
    .set(primaryKey, data)
    .set(emailKey, primaryKey);

  const { ok } = await transaction.commit();
  if (!ok) {
    throw new AuthError('User already registered');
  }
  return { userId: ulidUser, name: data.name, email: data.email };
};

export const loginUser = async (
  data: LoginDTO,
): Promise<AuthResponse> => {
  const result = await getUserByEmail(data.email);
  if (!result || !result.user) {
    throw new AuthError('User or password is invalid');
  }
  const { primaryKey: [, userId], user } = result;
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
  const { value: primaryKeyUser } = await db.getEntry<UserKey>(
    authKeys.userEmail(email),
  );
  if (!primaryKeyUser) return null;
  const { value: userData } = await db.getEntry<RegisterDTO>(primaryKeyUser);
  return { user: userData, primaryKey: primaryKeyUser };
};
