import { Route } from '@std/http/unstable-route';
import { register } from '../services/register.ts';

export const routes: Route[] = [
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/register' }),
    handler: register,
  },
];
