import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { IsBoolean, IsInt, IsObject, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Prisma, Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { AuthGuard } from './guards/auth.guard';

class ActivityDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() type!: string;
  @IsString() subject!: string;
  @IsInt() @Min(1) @Max(7) ageMin!: number;
  @IsInt() @Min(1) @Max(7) ageMax!: number;
  @IsOptional() @IsString() coverUrl?: string;
  @IsObject() content!: Record<string, unknown>;
  @IsOptional() @IsBoolean() published?: boolean;
}

class CompletionDto { @IsString() childId!: string; @IsInt() @Min(0) @Max(100) score!: number; }

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivityController {
  constructor(private readonly prisma: PrismaService) {}

  @Get() list(@Req() req: { user: { role: Role; id: string } }) {
    if (req.user.role === Role.PARENT) return this.prisma.activity.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
    if (req.user.role === Role.ADMIN || req.user.role === Role.SUPERADMIN) return this.prisma.activity.findMany({ orderBy: { createdAt: 'desc' } });
    throw new UnauthorizedException();
  }

  @Post() create(@Req() req: { user: { role: Role } }, @Body() body: ActivityDto) {
    if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPERADMIN) throw new UnauthorizedException();
    return this.prisma.activity.create({ data: { ...body, content: body.content as Prisma.InputJsonValue } });
  }

  @Post(':id/complete') async complete(@Req() req: { user: { role: Role; id: string } }, @Param('id') id: string, @Body() body: CompletionDto) {
    if (req.user.role !== Role.PARENT) throw new UnauthorizedException('Parent token required for selected child activity');
    const child = await this.prisma.child.findFirst({ where: { id: body.childId, parentId: req.user.id } });
    if (!child) throw new UnauthorizedException('Child does not belong to this parent');
    const activity = await this.prisma.activity.findFirst({ where: { id, published: true } });
    if (!activity) throw new UnauthorizedException('Activity is not available');
    const stars = body.score >= 90 ? 3 : body.score >= 70 ? 2 : body.score >= 50 ? 1 : 0;
    const medal = stars === 3 ? 'GOLD' : stars === 2 ? 'SILVER' : stars === 1 ? 'BRONZE' : null;
    return this.prisma.activityCompletion.upsert({ where: { childId_activityId: { childId: child.id, activityId: id } }, update: { score: body.score, stars, medal, completedAt: new Date() }, create: { childId: child.id, activityId: id, score: body.score, stars, medal } });
  }
}
