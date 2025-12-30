import jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  // Generar token
  static generateToken(payload: any, duration: string = "2h") {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        JWT_SEED,
        { expiresIn: duration } as SignOptions,
        (err, token) => {
          if (err) return resolve(null);

          resolve(token);
        }
      );
    });
  }

  // Validar token
  // <T> es un estandar que significa que vamos a recibir cualquier cosa (string, dict, array) lo que sea pero el tipo que reciba tiene que retornarlo.
  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded as T);
      });
    });
  }
}
