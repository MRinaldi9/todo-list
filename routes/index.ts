import { STATUS_CODE } from '@std/http';
import { Route } from '@std/http/unstable-route';
import { db } from '../database/index.ts';
import { login, register } from '../services/auth.ts';
import { createTodo, updateTodo } from '../services/todo.ts';
import { withAuth } from '../utils/with-auth.ts';

export const routes: Route[] = [
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/register' }),
    handler: register,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/login' }),
    handler: login,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/posts' }),
    handler: withAuth(createTodo),
  },
  {
    method: 'PUT',
    pattern: new URLPattern({ pathname: '/posts/:id' }),
    handler: withAuth(updateTodo),
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/delete-db' }),
    handler: async () => {
      if (Deno.env.get('ENABLE_DELETE_DB') !== 'true') {
        return new Response(
          'Not found',
          { status: STATUS_CODE.NotFound },
        );
      }
      const results = await db.clearDb();
      const rejected = results.filter((result) => result.status === 'rejected');
      if (rejected.length > 0) {
        return Response.json(
          { message: 'Error clearing the database' },
          { status: STATUS_CODE.InternalServerError },
        );
      }
      return new Response('Database cleared');
    },
  },
];
