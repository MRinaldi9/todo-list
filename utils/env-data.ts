export function getEnv(key: string, defaultValue?: string): string {
  return Deno.env.get(key) ?? defaultValue ?? '';
}
