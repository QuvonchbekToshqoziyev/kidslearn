import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class CredentialsDto { @IsEmail() email!: string; @IsString() @MinLength(8) password!: string; }
class RegisterDto extends CredentialsDto { @IsString() @MinLength(2) name!: string; }

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() body: RegisterDto) { return this.auth.registerParent(body.name, body.email, body.password); }
  @Post('login') login(@Body() body: CredentialsDto) { return this.auth.login(body.email, body.password); }
}
