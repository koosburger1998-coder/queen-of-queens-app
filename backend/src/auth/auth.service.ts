import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async judgeLogin(code: string) {
    const judge = await this.prisma.judge.findFirst({
      where: { code: { equals: code, mode: 'insensitive' } },
    });

    if (!judge) throw new UnauthorizedException('Judge code not found.');

    const activeEvent = await this.prisma.event.findFirst({ where: { isActive: true } });
    if (!activeEvent) throw new UnauthorizedException('No active event found.');

    const assigned = await this.prisma.eventJudge.findFirst({
      where: { judgeId: judge.id, eventId: activeEvent.id },
    });

    if (!assigned) throw new UnauthorizedException('This judge is not assigned to the active event.');

    const token = this.jwt.sign({
      sub: judge.id,
      role: 'judge',
      judgeId: judge.id,
      judgeName: judge.name,
    });

    return { token, judge: { id: judge.id, name: judge.name } };
  }

  async adminLogin(code: string) {
    const settings = await this.prisma.appSettings.findFirst();
    const adminCode = settings?.adminCode || 'ADMIN2026';

    if (code.trim() !== adminCode.trim()) {
      throw new UnauthorizedException('Invalid admin code.');
    }

    const token = this.jwt.sign({ sub: 'admin', role: 'admin' }, { expiresIn: '12h' });
    return { token };
  }
}
