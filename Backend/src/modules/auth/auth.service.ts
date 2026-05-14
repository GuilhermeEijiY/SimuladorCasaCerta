import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { RegisterDto, LoginDto } from "./auth.dto";

export class AuthService {
  async register(data: RegisterDto) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError(409, "Email já cadastrado");

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

    const token = this.generateToken(user.id);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new AppError(401, "Credenciais inválidas");

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new AppError(401, "Credenciais inválidas");

    const token = this.generateToken(user.id);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, "Usuário não encontrado");
    return { id: user.id, name: user.name, email: user.email };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "24h" });
  }
}
