import { route } from '@std/http/unstable-route';
import { generateSecret } from './generate-secret.ts';
import { routes } from './routes/index.ts';

generateSecret();

export default {
  fetch: route(routes, (req) => {
    return new Response('Hello World');
  }),
} satisfies Deno.ServeDefaultExport;
