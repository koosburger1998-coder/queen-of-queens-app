import { Controller, Get, Post, Put, Param, Body, UseGuards, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';
import { CompetitionService } from './competition.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/admin')
@UseGuards(AdminGuard)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get('state')
  getAdminState() {
    return this.competitionService.getAdminState();
  }

  @Get('competition')
  getConfig() {
    return this.competitionService.getConfig();
  }

  @Put('competition')
  updateConfig(@Body() body: { totalContestants?: number; heats?: number; contestantsPerHeat?: number; songsPerContestant?: number }) {
    return this.competitionService.updateConfig(body);
  }

  @Post('competition/setup')
  @HttpCode(200)
  setupRounds() {
    return this.competitionService.setupRounds();
  }

  @Post('competition/populate/:roundKey')
  @HttpCode(200)
  populateRound(@Param('roundKey') roundKey: string) {
    return this.competitionService.populateNextRound(roundKey);
  }

  @Post('events/:eventId/winners')
  @HttpCode(200)
  setWinners(@Param('eventId') eventId: string, @Body() body: { winnerIds: string[]; wildcardIds?: string[] }) {
    return this.competitionService.setEventWinners(eventId, body.winnerIds, body.wildcardIds);
  }

  @Put('settings')
  updateSettings(@Body() body: { adminCode: string }) {
    return this.competitionService.updateSettings(body.adminCode);
  }

  @Get('export/:eventId/results.csv')
  async exportCsv(@Param('eventId') eventId: string, @Res() res: Response) {
    const csv = await this.competitionService.exportCsv(eventId);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="queen_of_queens_${eventId}_results.csv"`);
    res.send(csv);
  }
}
