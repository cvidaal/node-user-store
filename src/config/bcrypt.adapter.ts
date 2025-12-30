import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export const bcryptAdapter = {
  // Método para regresar contraseña encriptada
  hash: (password: string) => {
    const salt = genSaltSync();
    return hashSync(password, salt);
  },

  // Comparar contraseñas
  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  },
};
