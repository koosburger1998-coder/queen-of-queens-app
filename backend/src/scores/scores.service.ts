import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  async getJudgeState(judgeId: string) {
    const event = await this.prisma.event.findFirst({ where: { isActive: true } });
    if (!event) return { event: null, categories: [], contestants: [], myScores: [], canJudge: false };

    const [categories, eventContestants, eventJudge, myScores] = await Promise.all([
      this.prisma.category.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.eventContestant.findMany({
        where: { eventId: event.id },
        include: { contestant: true },
        orderBy: { order: 'asc' },
      }),
      this.prisma.eventJudge.findFirst({ where: { eventId: event.id, judgeId } }),
      this.prisma.score.findMany({
        where: { eventId: event.id, judgeId },
        include: { values: { include: { category: true } } },
      }),
    ]);

    const contestants = eventContestants.map((ec) => ({
      ...ec.contestant,
      order: ec.order,
      style: ec.style,
      notes: ec.notes,
    }));

    const scores = myScores.map((s) => ({
      id: s.id,
      contestantId: s.contestantId,
      comment: s.comment,
      updatedAt: s.updatedAt,
      values: Object.fromEntries(s.values.map((v) => [v.categoryId, v.value])),
    }));

    return { event, categories, contestants, myScores: scores, canJudge: !!eventJudge };
  }

  async submit(judgeId: string, dto: SubmitScoreDto) {
    const event = await this.prisma.event.findFirst({ where: { isActive: true } });
    if (!event) throw new BadRequestException('No active event found.');
    if (event.scoringLocked) throw new ForbiddenException('Scoring is locked.');

    const [categories, contestant, eventJudge, eventContestant] = await Promise.all([
      this.prisma.category.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.contestant.findUnique({ where: { id: dto.contestantId } }),
      this.prisma.eventJudge.findFirst({ where: { eventId: event.id, judgeId } }),
      this.prisma.eventContestant.findFirst({ where: { eventId: event.id, contestantId: dto.contestantId } }),
    ]);

    if (!contestant || !eventContestant) throw new BadRequestException('Contestant not found for this event.');
    if (!eventJudge) throw new ForbiddenException('This judge is not assigned to the active event.');

    for (const cat of categories) {
      const val = Number(dto.values[cat.id]);
      if (!Number.isFinite(val) || val < 1 || val > 10) {
        throw new BadRequestException(`Score for ${cat.name} must be between 1 and 10.`);
      }
    }

    const requiresComment = Object.values(dto.values).some((v) => Number(v) === 1 || Number(v) === 10);
    if (requiresComment && (dto.comment || '').trim().length < 5) {
      throw new BadRequestException('A comment is required when giving a 1 or 10.');
    }

    const existing = await this.prisma.score.findFirst({
      where: { eventId: event.id, judgeId, contestantId: dto.contestantId },
    });

    if (existing) {
      await this.prisma.scoreValue.deleteMany({ where: { scoreId: existing.id } });
      await this.prisma.score.update({
        where: { id: existing.id },
        data: {
          comment: (dto.comment || '').trim(),
          values: { create: categories.map((c) => ({ categoryId: c.id, value: Number(dto.values[c.id]) })) },
        },
      });
    } else {
      await this.prisma.score.create({
        data: {
          eventId: event.id,
          judgeId,
          contestantId: dto.contestantId,
          comment: (dto.comment || '').trim(),
          values: { create: categories.map((c) => ({ categoryId: c.id, value: Number(dto.values[c.id]) })) },
        },
      });
    }

    this.gateway.broadcastStateChange();
    return { ok: true };
  }

  async getAdminScores(eventId: string) {
    return this.prisma.score.findMany({
      where: { eventId },
      include: { values: true, judge: true, contestant: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async adminUpdate(scoreId: string, values: Record<string, number>, comment: string) {
    const score = await this.prisma.score.findUnique({ where: { id: scoreId } });
    if (!score) throw new NotFoundException('Score not found.');
    await this.prisma.scoreValue.deleteMany({ where: { scoreId } });
    const categories = await this.prisma.category.findMany();
    for (const cat of categories) {
      const val = Number(values[cat.id]);
      if (!Number.isFinite(val) || val < 1 || val > 10) {
        throw new BadRequestException(`Score for ${cat.name} must be between 1 and 10.`);
      }
    }
    await this.prisma.score.update({
      where: { id: scoreId },
      data: {
        comment: (comment || '').trim(),
        values: { create: categories.map((c) => ({ categoryId: c.id, value: Number(values[c.id]) })) },
      },
    });
    this.gateway.broadcastStateChange();
    return { ok: true };
  }

  async adminDelete(scoreId: string) {
    await this.prisma.score.delete({ where: { id: scoreId } });
    this.gateway.broadcastStateChange();
  }

  async resetEventScores(eventId: string) {
    await this.prisma.score.deleteMany({ where: { eventId } });
    this.gateway.broadcastStateChange();
  }
}
