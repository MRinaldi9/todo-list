import { GenericSchema, safeParse, SafeParseResult } from 'valibot';

export async function bodyParse<T extends GenericSchema>(
  req: Request,
  schema: T,
): Promise<SafeParseResult<T>> {
  const bodyRaw = await req.json();
  const parsedBody = safeParse(schema, bodyRaw);
  return parsedBody;
}
