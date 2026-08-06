import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminController } from './admin.controller';
import { ParentController } from './parent.controller';
import { ActivityController } from './activity.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, AuthController, AdminController, ParentController, ActivityController],
  providers: [PrismaService, AuthService],
  exports: [PrismaService, AuthService],
})
export class AppModule {}
