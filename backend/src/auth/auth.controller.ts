import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JudgeLoginDto } from './dto/judge-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('judge/login')
  @HttpCode(200)
  judgeLogin(@Body() dto: JudgeLoginDto) {
    return this.authService.judgeLogin(dto.code);
  }

  @Post('admin/login')
  @HttpCode(200)
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.code);
  }
}
