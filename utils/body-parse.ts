import { GenericSchema, safeParse } from 'valibot';

export async function bodyParse<T extends GenericSchema>(
  req: Request,
  schema: T,
) {
  const bodyRaw = await req.json();
  const parsedBody = safeParse(schema, bodyRaw);
  return parsedBody;
}
