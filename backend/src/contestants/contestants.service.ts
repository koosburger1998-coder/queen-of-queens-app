import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { UpdateContestantDto } from './dto/update-contestant.dto';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class ContestantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  findAll() {
    return this.prisma.contestant.findMany({ orderBy: { stageName: 'asc' } });
  }

  async create(dto: CreateContestantDto) {
    if (!dto.stageName?.trim()) throw new BadRequestException('Stage name is required.');
    const contestant = await this.prisma.contestant.create({
      data: {
        stageName: dto.stageName.trim(),
        style: dto.style?.trim() || 'Heat Performance',
        notes: dto.notes?.trim() || '',
      },
    });
    this.gateway.broadcastStateChange();
    return contestant;
  }

  async update(id: string, dto: UpdateContestantDto) {
    const contestant = await this.prisma.contestant.findUnique({ where: { id } });
    if (!contestant) throw new NotFoundException('Contestant not found.');

    const updated = await this.prisma.contestant.update({
      where: { id },
      data: {
        stageName: dto.stageName?.trim() ?? contestant.stageName,
        style: dto.style?.trim() ?? contestant.style,
        notes: dto.notes?.trim() ?? contestant.notes,
      },
    });

    if (dto.order !== undefined) {
      const activeEvent = await this.prisma.event.findFirst({ where: { isActive: true } });
      if (activeEvent) {
        await this.prisma.eventContestant.updateMany({
          where: { contestantId: id, eventId: activeEvent.id },
          data: { order: dto.order, style: updated.style, notes: updated.notes },
        });
      }
    }

    this.gateway.broadcastStateChange();
    return updated;
  }

  async remove(id: string) {
    await this.prisma.contestant.delete({ where: { id } });
    this.gateway.broadcastStateChange();
  }
}
