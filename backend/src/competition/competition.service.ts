import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';

const ROUND_ORDER = [
  'heat_1', 'heat_2', 'heat_3', 'heat_4', 'heat_5', 'heat_6', 'heat_7',
  'quarter_final', 'semi_final', 'grand_final',
];

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  async getConfig() {
    return this.prisma.competition.findFirst();
  }

  async updateConfig(data: { totalContestants?: number; heats?: number; contestantsPerHeat?: number; songsPerContestant?: number }) {
    const config = await this.prisma.competition.findFirst();
    if (!config) throw new BadRequestException('No competition config found.');
    const updated = await this.prisma.competition.update({ where: { id: config.id }, data });
    this.gateway.broadcastStateChange();
    return updated;
  }

  async getAdminState() {
    const [settings, events, contestants, judges, categories, guestCategories, config] = await Promise.all([
      this.prisma.appSettings.findFirst(),
      this.prisma.event.findMany({
        include: {
          contestants: { include: { contestant: true }, orderBy: { order: 'asc' } },
          judges: { include: { judge: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.contestant.findMany({ orderBy: { stageName: 'asc' } }),
      this.prisma.judge.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.category.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.guestCategory.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.competition.findFirst(),
    ]);

    const activeEvent = events.find((e) => e.isActive) || events[0] || null;

    const scores = activeEvent
      ? await this.prisma.score.findMany({
          where: { eventId: activeEvent.id },
          include: { values: { include: { category: true } }, judge: true, contestant: true },
        })
      : [];

    const guestVotes = activeEvent
      ? await this.prisma.guestVote.findMany({
          where: { eventId: activeEvent.id },
          include: { choices: { include: { guestCategory: true, contestant: true } } },
        })
      : [];

    const leaderboard = this.buildLeaderboard(activeEvent, scores, categories, contestants);
    const missingVotes = this.buildMissingVotes(activeEvent, scores, judges, contestants);
    const guestSummary = this.buildGuestSummary(guestCategories, activeEvent, guestVotes);

    const competitionEvents = events
      .filter((e) => e.roundKey)
      .sort((a, b) => ROUND_ORDER.indexOf(a.roundKey!) - ROUND_ORDER.indexOf(b.roundKey!));

    return {
      settings: { adminCode: settings?.adminCode },
      activeEvent: this.publicEvent(activeEvent),
      events: events.map((e) => ({ ...this.publicEvent(e), isActive: e.isActive })),
      competitionEvents: competitionEvents.map((e) => ({ ...this.publicEvent(e), isActive: e.isActive })),
      competition: config,
      contestants: activeEvent
        ? activeEvent.contestants.map((ec) => ({ ...ec.contestant, order: ec.order, style: ec.style, notes: ec.notes }))
        : [],
      allContestants: contestants,
      judges: activeEvent ? activeEvent.judges.map((ej) => ej.judge) : [],
      allJudges: judges,
      categories,
      guestCategories,
      scores: scores.map((s) => ({
        id: s.id,
        eventId: s.eventId,
        judgeId: s.judgeId,
        judgeName: s.judge.name,
        contestantId: s.contestantId,
        contestantName: s.contestant.stageName,
        comment: s.comment,
        updatedAt: s.updatedAt,
        values: Object.fromEntries(s.values.map((v) => [v.categoryId, v.value])),
        total: s.values.reduce((sum, v) => sum + v.value, 0),
      })),
      guestSummary,
      leaderboard,
      missingVotes,
    };
  }

  async setupRounds() {
    const config = await this.prisma.competition.findFirst();
    if (!config) throw new BadRequestException('No competition config found.');

    const { heats, contestantsPerHeat } = config;
    const totalNeeded = heats * contestantsPerHeat;
    const contestants = await this.prisma.contestant.findMany({ take: totalNeeded, orderBy: { stageName: 'asc' } });

    while (contestants.length < totalNeeded) {
      contestants.push({
        id: `slot_${contestants.length + 1}`,
        stageName: `Contestant ${contestants.length + 1}`,
        style: 'Heat Performance',
        notes: '',
      });
    }

    const judges = await this.prisma.judge.findMany();

    const heatRounds = Array.from({ length: heats }, (_, i) => ({
      key: `heat_${i + 1}`,
      name: `Heat ${i + 1}`,
      stage: 'Heat',
      roundType: 'heat',
      date: '',
      expectedContestants: contestantsPerHeat,
      songCount: 3,
      advanceCount: 1,
      description: `${contestantsPerHeat} contestants compete. One winner advances.`,
    }));

    const otherRounds = [
      { key: 'quarter_final', name: 'Quarter Final', stage: 'Quarter Final', roundType: 'quarter_final', date: '', expectedContestants: heats + 2, songCount: 3, advanceCount: 5, description: `${heats} heat winners plus 2 wildcards. Top 5 advance.` },
      { key: 'semi_final', name: 'Semi-Final', stage: 'Semi-Final', roundType: 'semi_final', date: '', expectedContestants: 5, songCount: 3, advanceCount: 3, description: '5 contestants compete. Top 3 advance.' },
      { key: 'grand_final', name: 'Grand Final', stage: 'Grand Final', roundType: 'grand_final', date: '', expectedContestants: 3, songCount: 3, advanceCount: 1, description: 'Top 3 compete for QUEEN OF QUEENS — SLAYER OF THE STAGE!' },
    ];

    for (let i = 0; i < heatRounds.length; i++) {
      const round = heatRounds[i];
      const heatContestants = contestants.slice(i * contestantsPerHeat, (i + 1) * contestantsPerHeat);
      await this.upsertRoundEvent(round, heatContestants.filter((c) => !c.id.startsWith('slot_')), judges);
    }

    for (const round of otherRounds) {
      await this.upsertRoundEvent(round, [], judges);
    }

    const firstHeatEvent = await this.prisma.event.findFirst({ where: { roundKey: 'heat_1' } });
    if (firstHeatEvent) {
      await this.prisma.event.updateMany({ data: { isActive: false } });
      await this.prisma.event.update({ where: { id: firstHeatEvent.id }, data: { isActive: true } });
    }

    this.gateway.broadcastStateChange();
    return this.getAdminState();
  }

  async updateSettings(adminCode: string) {
    const settings = await this.prisma.appSettings.findFirst();
    if (settings) {
      await this.prisma.appSettings.update({ where: { id: settings.id }, data: { adminCode: adminCode.trim() } });
    }
    this.gateway.broadcastStateChange();
  }

  async setEventWinners(eventId: string, winnerIds: string[], wildcardIds: string[] = []) {
    await this.prisma.eventWinner.deleteMany({ where: { eventId } });
    const creates = [
      ...winnerIds.map((contestantId) => ({ eventId, contestantId, type: 'winner' })),
      ...wildcardIds.map((contestantId) => ({ eventId, contestantId, type: 'wildcard' })),
    ];
    if (creates.length) await this.prisma.eventWinner.createMany({ data: creates });
    this.gateway.broadcastStateChange();
  }

  async populateNextRound(roundKey: string) {
    const event = await this.prisma.event.findFirst({ where: { roundKey } });
    if (!event) throw new BadRequestException(`No event found for round ${roundKey}.`);

    const leaderboardFn = async (sourceEventId: string, count: number) => {
      const [scores, cats, eContestants] = await Promise.all([
        this.prisma.score.findMany({ where: { eventId: sourceEventId }, include: { values: true } }),
        this.prisma.category.findMany(),
        this.prisma.eventContestant.findMany({ where: { eventId: sourceEventId }, include: { contestant: true }, orderBy: { order: 'asc' } }),
      ]);
      return eContestants
        .map((ec) => {
          const contestantScores = scores.filter((s) => s.contestantId === ec.contestantId);
          const total = contestantScores.reduce((sum, s) => sum + s.values.reduce((sv, v) => sv + v.value, 0), 0);
          return { contestantId: ec.contestantId, total, order: ec.order };
        })
        .sort((a, b) => b.total - a.total || a.order - b.order)
        .slice(0, count)
        .map((r) => r.contestantId);
    };

    if (roundKey === 'quarter_final') {
      const config = await this.prisma.competition.findFirst();
      const heatKeys = Array.from({ length: config!.heats }, (_, i) => `heat_${i + 1}`);
      const heatEvents = await this.prisma.event.findMany({ where: { roundKey: { in: heatKeys } } });
      const winners = await this.prisma.eventWinner.findMany({
        where: { eventId: { in: heatEvents.map((e) => e.id) }, type: 'winner' },
      });
      const winnerIds = heatEvents.map((he) => {
        const w = winners.find((w) => w.eventId === he.id);
        return w?.contestantId;
      }).filter(Boolean) as string[];

      const wildcards = await this.prisma.eventWinner.findMany({ where: { eventId: event.id, type: 'wildcard' } });
      const allIds = [...new Set([...winnerIds, ...wildcards.map((w) => w.contestantId)])].slice(0, config!.heats + 2);
      await this.setEventContestants(event.id, allIds);
    } else if (roundKey === 'semi_final') {
      const qfEvent = await this.prisma.event.findFirst({ where: { roundKey: 'quarter_final' } });
      if (qfEvent) {
        const ids = await leaderboardFn(qfEvent.id, 5);
        await this.setEventContestants(event.id, ids);
      }
    } else if (roundKey === 'grand_final') {
      const sfEvent = await this.prisma.event.findFirst({ where: { roundKey: 'semi_final' } });
      if (sfEvent) {
        const ids = await leaderboardFn(sfEvent.id, 3);
        await this.setEventContestants(event.id, ids);
      }
    }

    this.gateway.broadcastStateChange();
    return this.getAdminState();
  }

  async exportCsv(eventId: string): Promise<string> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    const [categories, eContestants, judges, scores, guestCategories, guestVotes] = await Promise.all([
      this.prisma.category.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.eventContestant.findMany({ where: { eventId }, include: { contestant: true }, orderBy: { order: 'asc' } }),
      this.prisma.judge.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.score.findMany({ where: { eventId }, include: { values: true, judge: true, contestant: true } }),
      this.prisma.guestCategory.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.guestVote.findMany({ where: { eventId }, include: { choices: { include: { guestCategory: true, contestant: true } } } }),
    ]);

    const esc = (v: any) => `"${String(v ?? '').replaceAll('"', '""')}"`;

    const leaderboard = eContestants.map((ec) => {
      const cScores = scores.filter((s) => s.contestantId === ec.contestantId);
      const total = cScores.reduce((sum, s) => sum + s.values.reduce((sv, v) => sv + v.value, 0), 0);
      return { ...ec.contestant, order: ec.order, style: ec.style, total, votes: cScores.length };
    }).sort((a, b) => b.total - a.total);

    const rows: any[][] = [
      ['Event', event?.name || ''],
      ['Date', event?.date || ''],
      ['Venue', event?.venue || ''],
      [],
      ['Rank', 'Contestant', 'Style', 'Total Points', 'Judge Votes', ...categories.map((c) => `${c.name} Points`)],
    ];

    leaderboard.forEach((row, i) => {
      const catPoints = categories.map((cat) => {
        const vals = scores.filter((s) => s.contestantId === row.id).flatMap((s) => s.values.filter((v) => v.categoryId === cat.id).map((v) => v.value));
        return vals.length ? vals.reduce((a, b) => a + b, 0).toFixed(2) : '';
      });
      rows.push([i + 1, row.stageName, row.style, row.total.toFixed(2), `${row.votes}/${judges.length}`, ...catPoints]);
    });

    rows.push([], ['Judge Breakdown'], ['Contestant', 'Judge', ...categories.map((c) => c.name), 'Total', 'Comment', 'Updated At']);
    for (const s of scores) {
      rows.push([s.contestant.stageName, s.judge.name, ...categories.map((c) => s.values.find((v) => v.categoryId === c.id)?.value ?? ''), s.values.reduce((a, v) => a + v.value, 0).toFixed(2), s.comment, s.updatedAt.toISOString()]);
    }

    rows.push([], ['Audience Votes — Not Counted In Judge Results'], ['Category', 'Contestant', 'Votes']);
    for (const cat of guestCategories) {
      const totals = eContestants.map((ec) => ({ name: ec.contestant.stageName, count: guestVotes.filter((v) => v.choices.some((ch) => ch.guestCategoryId === cat.id && ch.contestantId === ec.contestantId)).length })).sort((a, b) => b.count - a.count);
      for (const t of totals) rows.push([cat.name, t.name, t.count]);
    }

    return rows.map((row) => row.map(esc).join(',')).join('\n');
  }

  private publicEvent(event: any) {
    if (!event) return null;
    const { judges, contestants, ...rest } = event;
    return {
      ...rest,
      assignedJudgeIds: judges?.map((ej: any) => ej.judgeId) ?? [],
      assignedContestantIds: contestants?.map((ec: any) => ec.contestantId) ?? [],
    };
  }

  private async upsertRoundEvent(round: any, contestants: any[], judges: any[]) {
    const eventId = `round_${round.key}`;
    const existing = await this.prisma.event.findFirst({ where: { OR: [{ id: eventId }, { roundKey: round.key }] } });

    if (existing) {
      await this.prisma.event.update({ where: { id: existing.id }, data: { name: round.name, roundKey: round.key, roundType: round.roundType, stage: round.stage, expectedContestants: round.expectedContestants, songCount: round.songCount, advanceCount: round.advanceCount, description: round.description } });
      if (contestants.length) {
        await this.prisma.eventContestant.deleteMany({ where: { eventId: existing.id } });
        await this.prisma.eventContestant.createMany({ data: contestants.map((c, i) => ({ eventId: existing.id, contestantId: c.id, order: i + 1, style: c.style, notes: c.notes })) });
      }
      const existingJudgeIds = (await this.prisma.eventJudge.findMany({ where: { eventId: existing.id } })).map((ej) => ej.judgeId);
      for (const j of judges) {
        if (!existingJudgeIds.includes(j.id)) {
          await this.prisma.eventJudge.create({ data: { eventId: existing.id, judgeId: j.id } });
        }
      }
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const newEvent = await this.prisma.event.create({ data: { id: eventId, name: round.name, date: round.date || today, venue: "Rara's LGBTQ+ Bar", roundKey: round.key, roundType: round.roundType, stage: round.stage, expectedContestants: round.expectedContestants, songCount: round.songCount, advanceCount: round.advanceCount, description: round.description } });
      if (contestants.length) {
        await this.prisma.eventContestant.createMany({ data: contestants.map((c, i) => ({ eventId: newEvent.id, contestantId: c.id, order: i + 1, style: c.style, notes: c.notes })) });
      }
      await this.prisma.eventJudge.createMany({ data: judges.map((j) => ({ eventId: newEvent.id, judgeId: j.id })) });
    }
  }

  private async setEventContestants(eventId: string, contestantIds: string[]) {
    await this.prisma.eventContestant.deleteMany({ where: { eventId } });
    const contestants = await this.prisma.contestant.findMany({ where: { id: { in: contestantIds } } });
    const ordered = contestantIds.map((id) => contestants.find((c) => c.id === id)).filter(Boolean) as any[];
    await this.prisma.eventContestant.createMany({ data: ordered.map((c, i) => ({ eventId, contestantId: c.id, order: i + 1, style: c.style, notes: c.notes })) });
  }

  private buildLeaderboard(event: any, scores: any[], categories: any[], contestants: any[]) {
    if (!event) return [];
    const eventContestantIds = (event.contestants || []).map((ec: any) => ec.contestantId || ec.contestant?.id);
    return eventContestantIds
      .map((id: string, index: number) => {
        const cScores = scores.filter((s) => s.contestantId === id);
        const total = cScores.reduce((sum: number, s: any) => sum + s.values.reduce((sv: number, v: any) => sv + v.value, 0), 0);
        const c = contestants.find((c) => c.id === id);
        return { ...c, order: index + 1, total, votes: cScores.length };
      })
      .filter((r: any) => r.id)
      .sort((a: any, b: any) => b.total - a.total || a.order - b.order);
  }

  private buildMissingVotes(event: any, scores: any[], judges: any[], contestants: any[]) {
    if (!event) return [];
    const missing: any[] = [];
    const eventContestantIds = (event.contestants || []).map((ec: any) => ec.contestantId || ec.contestant?.id);
    const eventJudgeIds = (event.judges || []).map((ej: any) => ej.judgeId || ej.judge?.id);
    for (const cId of eventContestantIds) {
      for (const jId of eventJudgeIds) {
        if (!scores.some((s) => s.contestantId === cId && s.judgeId === jId)) {
          const c = contestants.find((c) => c.id === cId);
          const j = judges.find((j) => j.id === jId);
          if (c && j) missing.push({ contestantId: cId, contestantName: c.stageName, judgeId: jId, judgeName: j.name });
        }
      }
    }
    return missing;
  }

  private buildGuestSummary(categories: any[], event: any, votes: any[]) {
    if (!event) return [];
    const eventContestantIds = (event.contestants || []).map((ec: any) => ec.contestantId || ec.contestant?.id);
    return categories.map((cat) => {
      const totals = eventContestantIds.map((id: string) => ({
        contestantId: id,
        points: votes.filter((v) => v.choices.some((ch: any) => ch.guestCategoryId === cat.id && ch.contestantId === id)).length,
      })).sort((a: any, b: any) => b.points - a.points);
      return { categoryId: cat.id, categoryName: cat.name, totalVotes: totals.reduce((s: number, r: any) => s + r.points, 0), totals };
    });
  }
}
