import { route } from '@std/http/unstable-route';
import { routes } from './routes/index.ts';

export default {
  fetch: route(routes, (req) => {
    return new Response('Hello World');
  }),
} satisfies Deno.ServeDefaultExport;
