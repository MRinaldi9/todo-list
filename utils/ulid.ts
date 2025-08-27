import { Tagged } from '@gdquest/type-fest';
import { ulid as stdUlid } from '@std/ulid/ulid';
import { pipe, safeParse, string, ulid } from 'valibot';

export type ULID = Tagged<string, 'ULID'>;

export function generateUlid(): ULID {
  return stdUlid() as ULID;
}

const ULIDSchema = pipe(string(), ulid());

export function isValidUlid(id: string): id is ULID {
  return safeParse(ULIDSchema, id).success;
}
