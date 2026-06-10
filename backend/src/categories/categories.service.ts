import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
  ) {}

  findAllJudge() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  findAllGuest() {
    return this.prisma.guestCategory.findMany({ orderBy: { order: 'asc' } });
  }

  async createJudge(name: string) {
    if (!name?.trim()) throw new BadRequestException('Category name is required.');
    const count = await this.prisma.category.count();
    const category = await this.prisma.category.create({ data: { name: name.trim(), order: count + 1 } });
    this.gateway.broadcastStateChange();
    return category;
  }

  async createGuest(name: string) {
    if (!name?.trim()) throw new BadRequestException('Category name is required.');
    const count = await this.prisma.guestCategory.count();
    const category = await this.prisma.guestCategory.create({ data: { name: name.trim(), order: count + 1 } });
    this.gateway.broadcastStateChange();
    return category;
  }

  async updateJudge(id: string, name: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found.');
    const updated = await this.prisma.category.update({ where: { id }, data: { name: name.trim() } });
    this.gateway.broadcastStateChange();
    return updated;
  }

  async updateGuest(id: string, name: string) {
    const category = await this.prisma.guestCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found.');
    const updated = await this.prisma.guestCategory.update({ where: { id }, data: { name: name.trim() } });
    this.gateway.broadcastStateChange();
    return updated;
  }

  async removeJudge(id: string) {
    await this.prisma.category.delete({ where: { id } });
    this.gateway.broadcastStateChange();
  }

  async removeGuest(id: string) {
    await this.prisma.guestCategory.delete({ where: { id } });
    this.gateway.broadcastStateChange();
  }
}
