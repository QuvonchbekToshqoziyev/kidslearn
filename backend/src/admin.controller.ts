import { Body, Controller, Get, Post, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';
import { AuthGuard } from './guards/auth.guard';

class CreateAdminDto { @IsString() @MinLength(2) name!: string; @IsEmail() email!: string; @IsString() @MinLength(8) password!: string; }

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly auth: AuthService, private readonly prisma: PrismaService) {}
  @Post('admins') async createAdmin(@Req() req: { user: { id: string; role: Role } }, @Body() body: CreateAdminDto) {
    if (req.user.role !== Role.SUPERADMIN) throw new UnauthorizedException('Only superadmin can create admins');
    const actor = await this.prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });
    return this.auth.createAdmin(actor, body.name, body.email, body.password);
  }
  @Get('parents') listParents(@Req() req: { user: { role: Role } }) {
    if (req.user.role !== Role.SUPERADMIN && req.user.role !== Role.ADMIN) throw new UnauthorizedException();
    return this.prisma.user.findMany({ where: { role: Role.PARENT }, select: { id: true, name: true, email: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  }
}
