import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  async findAll() {
    return this.prisma.event.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async findActive() {
    return this.prisma.event.findFirst({ where: { isActive: true } });
  }

  async create(dto: CreateEventDto) {
    const today = new Date().toISOString().slice(0, 10);
    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        date: dto.date || today,
        venue: dto.venue || '',
        scoringLocked: dto.scoringLocked ?? false,
        guestVotingLocked: dto.guestVotingLocked ?? false,
        isActive: false,
      },
    });
    this.gateway.broadcastStateChange();
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found.');
    const updated = await this.prisma.event.update({ where: { id }, data: dto });
    this.gateway.broadcastStateChange();
    return updated;
  }

  async activate(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found.');
    await this.prisma.event.updateMany({ data: { isActive: false } });
    const active = await this.prisma.event.update({ where: { id }, data: { isActive: true } });
    this.gateway.broadcastStateChange();
    return active;
  }

  async remove(id: string) {
    const count = await this.prisma.event.count();
    if (count <= 1) throw new BadRequestException('You must keep at least one event.');
    await this.prisma.event.delete({ where: { id } });
    const remaining = await this.prisma.event.findFirst();
    if (remaining) {
      await this.prisma.event.update({ where: { id: remaining.id }, data: { isActive: true } });
    }
    this.gateway.broadcastStateChange();
  }

  async addContestant(eventId: string, contestantId: string) {
    const [event, contestant] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId } }),
      this.prisma.contestant.findUnique({ where: { id: contestantId } }),
    ]);
    if (!event || !contestant) throw new NotFoundException('Event or contestant not found.');
    const existing = await this.prisma.eventContestant.findUnique({
      where: { eventId_contestantId: { eventId, contestantId } },
    });
    if (existing) return existing;
    const count = await this.prisma.eventContestant.count({ where: { eventId } });
    const entry = await this.prisma.eventContestant.create({
      data: { eventId, contestantId, order: count + 1, style: contestant.style, notes: contestant.notes },
    });
    this.gateway.broadcastStateChange();
    return entry;
  }

  async removeContestant(eventId: string, contestantId: string) {
    await this.prisma.eventContestant.deleteMany({ where: { eventId, contestantId } });
    await this.prisma.score.deleteMany({ where: { eventId, contestantId } });
    this.gateway.broadcastStateChange();
  }

  async addJudge(eventId: string, judgeId: string) {
    const [event, judge] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId } }),
      this.prisma.judge.findUnique({ where: { id: judgeId } }),
    ]);
    if (!event || !judge) throw new NotFoundException('Event or judge not found.');
    await this.prisma.eventJudge.upsert({
      where: { eventId_judgeId: { eventId, judgeId } },
      create: { eventId, judgeId },
      update: {},
    });
    this.gateway.broadcastStateChange();
  }

  async removeJudge(eventId: string, judgeId: string) {
    await this.prisma.eventJudge.deleteMany({ where: { eventId, judgeId } });
    await this.prisma.score.deleteMany({ where: { eventId, judgeId } });
    this.gateway.broadcastStateChange();
  }
}
