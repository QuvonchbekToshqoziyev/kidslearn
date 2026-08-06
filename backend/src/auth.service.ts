import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from './prisma.service';

type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerParent(name: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash, role: Role.PARENT } });
    return this.issue(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
    return this.issue(user);
  }

  async createAdmin(actor: User, name: string, email: string, password: string) {
    if (actor.role !== Role.SUPERADMIN) throw new UnauthorizedException('Only superadmin can create admins');
    const passwordHash = await bcrypt.hash(password, 12);
    return this.prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash, role: Role.ADMIN, createdById: actor.id }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } });
  }

  token(user: Pick<User, 'id' | 'role' | 'email'>) {
    return jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_ACCESS_SECRET ?? 'development-only-secret', { expiresIn: '2h' });
  }

  async fromToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? 'development-only-secret') as { sub: string };
      return this.prisma.user.findUnique({ where: { id: payload.sub } });
    } catch { throw new UnauthorizedException('Invalid or expired token'); }
  }

  private issue(user: User) { const { passwordHash: _passwordHash, ...safe } = user; return { accessToken: this.token(user), user: safe as PublicUser }; }
}
