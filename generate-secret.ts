import { JWT, type JwtSymmetricAlgorithm } from '@bepalo/jwt/mod.ts';
import { getEnv } from './utils/env-data.ts';

export function generateSecret() {
  const secret = JWT.genHmac(
    getEnv('ALGORITHM', 'HS384') as JwtSymmetricAlgorithm,
  );

  Deno.env.set('SECRET_KEY', secret);
  console.log(Deno.env.toObject());
}
