import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedSettings();
    await this.seedCategories();
    await this.seedGuestCategories();
    await this.seedCompetition();
    await this.seedDefaultEvent();
  }

  private async seedSettings() {
    const existing = await this.prisma.appSettings.findFirst();
    if (!existing) {
      await this.prisma.appSettings.create({ data: { id: 1, adminCode: 'ADMIN2026' } });
    }
  }

  private async seedCategories() {
    const count = await this.prisma.category.count();
    if (count === 0) {
      await this.prisma.category.createMany({
        data: [
          { id: 'cat_look', name: 'Look / Outfit / Makeup', order: 1 },
          { id: 'cat_stage', name: 'Stage Presence', order: 2 },
          { id: 'cat_performance', name: 'Performance / Lip-sync', order: 3 },
          { id: 'cat_creativity', name: 'Creativity', order: 4 },
          { id: 'cat_audience', name: 'Audience Connection', order: 5 },
          { id: 'cat_overall', name: 'Overall Impression', order: 6 },
        ],
      });
    }
  }

  private async seedGuestCategories() {
    const count = await this.prisma.guestCategory.count();
    if (count === 0) {
      await this.prisma.guestCategory.createMany({
        data: [
          { id: 'guest_favourite', name: 'Fan Favourite', order: 1 },
          { id: 'guest_best_look', name: 'Best Look', order: 2 },
          { id: 'guest_stage_energy', name: 'Best Stage Energy', order: 3 },
        ],
      });
    }
  }

  private async seedCompetition() {
    const count = await this.prisma.competition.count();
    if (count === 0) {
      await this.prisma.competition.create({
        data: {
          name: 'Queen of Queens',
          title: 'QUEEN OF QUEENS — SLAYER OF THE STAGE!',
          totalContestants: 28,
          heats: 7,
          contestantsPerHeat: 4,
          songsPerContestant: 3,
        },
      });
    }
  }

  private async seedDefaultEvent() {
    const count = await this.prisma.event.count();
    if (count === 0) {
      const today = new Date().toISOString().slice(0, 10);
      await this.prisma.event.create({
        data: {
          name: 'Queen of Queens',
          date: today,
          venue: "Rara's LGBTQ+ Bar",
          isActive: true,
        },
      });
    }
  }
}
