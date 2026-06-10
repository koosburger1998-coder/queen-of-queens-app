import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
import { SubmitGuestVoteDto } from './dto/submit-guest-vote.dto';

@Injectable()
export class GuestVotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  async getState() {
    const event = await this.prisma.event.findFirst({ where: { isActive: true } });
    if (!event) return { event: null, contestants: [], categories: [], summary: [] };

    const [guestCategories, eventContestants, guestVotes] = await Promise.all([
      this.prisma.guestCategory.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.eventContestant.findMany({
        where: { eventId: event.id },
        include: { contestant: true },
        orderBy: { order: 'asc' },
      }),
      this.prisma.guestVote.findMany({
        where: { eventId: event.id },
        include: { choices: true },
      }),
    ]);

    const contestants = eventContestants.map((ec) => ({
      ...ec.contestant,
      order: ec.order,
      style: ec.style,
    }));

    const summary = this.buildSummary(guestCategories, contestants, guestVotes);
    return { event, contestants, categories: guestCategories, summary };
  }

  async submit(dto: SubmitGuestVoteDto) {
    const event = await this.prisma.event.findFirst({ where: { isActive: true } });
    if (!event) throw new BadRequestException('No active event found.');
    if (event.guestVotingLocked) throw new BadRequestException('Guest voting is closed.');

    if (!dto.voterToken || dto.voterToken.length < 8) {
      throw new BadRequestException('Could not verify this browser vote. Please refresh and try again.');
    }

    const alreadyVoted = await this.prisma.guestVote.findFirst({
      where: { eventId: event.id, voterToken: dto.voterToken },
    });
    if (alreadyVoted) throw new ConflictException('This phone/browser has already voted for this event.');

    const [guestCategories, eventContestants] = await Promise.all([
      this.prisma.guestCategory.findMany(),
      this.prisma.eventContestant.findMany({ where: { eventId: event.id } }),
    ]);

    const validContestantIds = new Set(eventContestants.map((ec) => ec.contestantId));

    for (const cat of guestCategories) {
      const chosen = dto.votes[cat.id];
      if (!chosen) throw new BadRequestException(`Please choose a contestant for ${cat.name}.`);
      if (!validContestantIds.has(chosen)) throw new BadRequestException(`Invalid contestant for ${cat.name}.`);
    }

    const voterName = dto.stayAnonymous || !dto.voterName?.trim() ? 'Anonymous' : dto.voterName.trim().slice(0, 80);

    const vote = await this.prisma.guestVote.create({
      data: {
        eventId: event.id,
        voterToken: dto.voterToken,
        voterName,
        anonymous: voterName === 'Anonymous',
        choices: {
          create: guestCategories.map((cat) => ({
            guestCategoryId: cat.id,
            contestantId: dto.votes[cat.id],
          })),
        },
      },
      include: { choices: true },
    });

    this.gateway.broadcastStateChange();

    const allVotes = await this.prisma.guestVote.findMany({
      where: { eventId: event.id },
      include: { choices: true },
    });
    const contestants = eventContestants.map((ec) => ({ id: ec.contestantId } as any));
    const summary = this.buildSummary(guestCategories, contestants, allVotes);

    return { ok: true, summary };
  }

  async getAdminVotes(eventId: string) {
    return this.prisma.guestVote.findMany({
      where: { eventId },
      include: { choices: { include: { guestCategory: true, contestant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resetEventVotes(eventId: string) {
    await this.prisma.guestVote.deleteMany({ where: { eventId } });
    this.gateway.broadcastStateChange();
  }

  private buildSummary(categories: any[], contestants: any[], votes: any[]) {
    return categories.map((cat) => {
      const totals = contestants.map((c) => ({
        contestantId: c.id,
        contestantName: c.stageName,
        order: c.order,
        points: votes.filter((v) => v.choices.some((ch: any) => ch.guestCategoryId === cat.id && ch.contestantId === c.id)).length,
      })).sort((a, b) => b.points - a.points || (a.order || 0) - (b.order || 0));

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        totalVotes: totals.reduce((s, r) => s + r.points, 0),
        leader: totals[0] || null,
        totals,
      };
    });
  }
}
