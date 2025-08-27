import {
  JWT,
  JwtError,
  JwtErrorCode,
  JwtPayload,
  JwtResult,
} from '@bepalo/jwt/mod.ts';
import { ULID } from '../utils/ulid.ts';

/**
 * Definiamo un tipo per il payload che la nostra applicazione userà.
 * 'sub' (subject) è uno standard per l'ID dell'utente.
 */
export type AppPayload = {
  email: string;
  name: string;
  sub: ULID; // ID utente
};

class JwtService {
  static #instance: JwtService;
  #jwtInstance: JWT<AppPayload>;
  #payloadToken: JwtPayload<AppPayload> | undefined;

  private constructor() {
    const secretKey = Deno.env.get('SECRET_KEY');
    if (!secretKey) {
      console.error(
        "FATAL: SECRET_KEY non è definita nelle variabili d'ambiente.",
      );
      throw new Error('SECRET_KEY is not defined');
    }

    // 2. Crea l'istanza JWT una sola volta.
    this.#jwtInstance = JWT.createSymmetric(secretKey, 'HS256');
  }

  get payloadToken(): JwtPayload<AppPayload> | undefined {
    return this.#payloadToken;
  }

  /**
   * Ottiene l'istanza singleton del servizio.
   */
  public static getInstance(): JwtService {
    if (!this.#instance) {
      this.#instance = new JwtService();
    }
    return this.#instance;
  }

  /**
   * Firma un payload e restituisce un token JWT.
   * @param payload I dati da includere nel token (es. ID utente).
   * @param expiresIn Durata del token (es. "2h", "7d", "30m").
   * @returns Il token JWT firmato.
   */
  public signToken(
    payload: AppPayload,
    expiresIn = Date.now() + 3600 * 1000,
  ): string {
    const token = this.#jwtInstance.signSync({
      ...payload,
      iat: JWT.now(), // Issued at (ora)
      exp: JWT.on(expiresIn), // Expiration time
    });
    return token;
  }

  /**
   * Verifica un token e restituisce il payload se valido.
   * @param token Il token JWT da verificare.
   * @returns Il payload del token se valido, altrimenti null.
   */
  public verifyToken(req: Request): Omit<JwtResult<AppPayload>, 'payload'> {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return {
        valid: false,
        error: new JwtError(
          req.method !== 'POST' ? 'Forbidden' : 'Unauthorized',
          JwtErrorCode.tokenHeaderInvalid,
        ),
      };
    }

    const { payload, valid, error } = this.#jwtInstance.verifySync(token);
    this.#payloadToken = payload;
    return { valid, error };
  }
}

// Esporta una singola istanza del servizio da usare in tutta l'applicazione.
export const jwtService = JwtService.getInstance();
