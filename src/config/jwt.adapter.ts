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
  static validateToken(token: string) {
    throw new Error("Not implemented");
    return;
  }
}
