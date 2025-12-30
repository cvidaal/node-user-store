import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  //DI
  constructor() {}

  // Creación del usuario
  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);

      // Encriptar contraseña.
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save(); // Guardar usuario en la base de datos

      // JWT <--- para mantener la autenticación del usuario.
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      // Email de confirmación.

      // Enviar sin el password
      const { password, ...rest } = UserEntity.fromObject(user);

      return { user: rest, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

    return "todo OK!";
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    // 1. FindOne para verificar si existe
    const existUser = await UserModel.findOne({ email: loginUserDto.email });
    if (!existUser) throw CustomError.unauthorized("Email is not exist");

    // 2. isMatch bcryp compare (password, AKSJDHSAHDSJASK)
    const isMatch = bcryptAdapter.compare(
      loginUserDto.password,
      existUser.password
    );

    if (!isMatch) throw CustomError.unauthorized("Invalid Password");

    const { password, ...userEntity } = UserEntity.fromObject(existUser);

    // Generar token
    const token = await JwtAdapter.generateToken({ id: existUser.id });
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      user: userEntity,
      token: token,
    };
  }
}
