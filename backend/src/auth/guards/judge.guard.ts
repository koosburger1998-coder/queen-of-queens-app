import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JudgeGuard extends JwtAuthGuard {
  canActivate(context: any) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) throw err || new ForbiddenException('Judge access required.');
    if (user.role !== 'judge') throw new ForbiddenException('Judge access required.');
    return user;
  }
}
