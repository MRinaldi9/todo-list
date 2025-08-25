import { route } from '@std/http/unstable-route';
import { routes } from './routes/index.ts';
import { db } from './database/index.ts';
import { log } from 'node:console';
import { PrimaryKey } from './queries-key/index.ts';

export default {
  fetch: route(routes, async (req) => {
    const entries = await db.getEntries({ prefix: [PrimaryKey.Todos] });

    log(entries);
    return new Response('Hello World');
  }),
} satisfies Deno.ServeDefaultExport;
