import { STATUS_CODE } from '@std/http/status';
import { Handler } from '@std/http/unstable-route';
import { jwtService } from '../services/jwt.ts';

/**
 * HOF che avvolge un handler per richiedere l'autenticazione.
 * @param handler L'handler da eseguire se l'utente è autenticato.
 * @returns Un handler standard che può essere usato nelle rotte.
 */
export function withAuth(handler: Handler): Handler {
  return async (req, params, info) => {
    const { valid, error } = jwtService.verifyToken(req);

    if (!valid) {
      return new Response(
        JSON.stringify({ message: error?.message || 'Unauthorized' }),
        {
          status: req.method === 'POST'
            ? STATUS_CODE.Unauthorized
            : STATUS_CODE.Forbidden,
        },
      );
    }

    return await handler(req, params, info);
  };
}
