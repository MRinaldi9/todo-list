import { Route } from '@std/http/unstable-route';
import { login, register } from '../services/auth.ts';

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
];
