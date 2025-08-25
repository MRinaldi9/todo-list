import { Route } from '@std/http/unstable-route';
import { login, register } from '../services/auth.ts';
import { createTodo } from '../services/todo.ts';
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
];
