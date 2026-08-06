import { Body, Controller, Get, Param, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { AuthGuard } from './guards/auth.guard';

class ChildDto { @IsString() @MinLength(2) name!: string; @IsDateString() birthDate!: string; @IsOptional() @IsString() avatarUrl?: string; }

@ApiTags('parent')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('parent')
export class ParentController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('children') list(@Req() req: { user: { id: string; role: Role } }) { if (req.user.role !== Role.PARENT) throw new UnauthorizedException(); return this.prisma.child.findMany({ where: { parentId: req.user.id }, orderBy: { createdAt: 'asc' } }); }
  @Post('children') create(@Req() req: { user: { id: string; role: Role } }, @Body() body: ChildDto) { if (req.user.role !== Role.PARENT) throw new UnauthorizedException(); return this.prisma.child.create({ data: { ...body, parentId: req.user.id, birthDate: new Date(body.birthDate) } }); }
  @Get('children/:id') async get(@Req() req: { user: { id: string; role: Role } }, @Param('id') id: string) { if (req.user.role !== Role.PARENT) throw new UnauthorizedException(); const child = await this.prisma.child.findFirst({ where: { id, parentId: req.user.id } }); if (!child) throw new UnauthorizedException('Child does not belong to this parent'); return child; }
  @Get('children/:id/progress') async progress(@Req() req: { user: { id: string; role: Role } }, @Param('id') id: string) {
    if (req.user.role !== Role.PARENT) throw new UnauthorizedException();
    const child = await this.prisma.child.findFirst({ where: { id, parentId: req.user.id }, include: { completions: { orderBy: { completedAt: 'desc' }, include: { activity: true } } } });
    if (!child) throw new UnauthorizedException('Child does not belong to this parent');
    return { child: { id: child.id, name: child.name }, completedActivities: child.completions.length, points: child.completions.reduce((sum, item) => sum + item.score, 0), stars: child.completions.reduce((sum, item) => sum + item.stars, 0), recent: child.completions.slice(0, 10) };
  }
  @Get('notifications') notifications(@Req() req: { user: { id: string; role: Role } }) {
    if (req.user.role !== Role.PARENT) throw new UnauthorizedException();
    return this.prisma.notification.findMany({ where: { parentId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 30 });
  }
}
