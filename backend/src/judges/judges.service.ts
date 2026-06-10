import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class JudgesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  findAll() {
    return this.prisma.judge.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateJudgeDto) {
    const codeConflict = await this.prisma.judge.findFirst({
      where: { code: { equals: dto.code.trim(), mode: 'insensitive' } },
    });
    if (codeConflict) throw new ConflictException('Judge code already exists.');

    const judge = await this.prisma.judge.create({
      data: { name: dto.name.trim(), code: dto.code.trim() },
    });

    const events = await this.prisma.event.findMany();
    await Promise.all(
      events.map((event) =>
        this.prisma.eventJudge.upsert({
          where: { eventId_judgeId: { eventId: event.id, judgeId: judge.id } },
          create: { eventId: event.id, judgeId: judge.id },
          update: {},
        }),
      ),
    );

    this.gateway.broadcastStateChange();
    return judge;
  }

  async update(id: string, dto: UpdateJudgeDto) {
    const judge = await this.prisma.judge.findUnique({ where: { id } });
    if (!judge) throw new NotFoundException('Judge not found.');

    if (dto.code) {
      const conflict = await this.prisma.judge.findFirst({
        where: { code: { equals: dto.code.trim(), mode: 'insensitive' }, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Judge code already exists.');
    }

    const updated = await this.prisma.judge.update({
      where: { id },
      data: { name: dto.name?.trim(), code: dto.code?.trim() },
    });

    this.gateway.broadcastStateChange();
    return updated;
  }

  async remove(id: string) {
    await this.prisma.judge.delete({ where: { id } });
    this.gateway.broadcastStateChange();
  }
}
