import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  //DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService
  ) {}

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
      await this.sendEmailValidationLink(user.email);

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

  // Email
  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("Email not exists");

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
