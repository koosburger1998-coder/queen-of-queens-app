import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode, Req } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JudgeGuard } from '../auth/guards/judge.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Controller('api/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('judge/state')
  @UseGuards(JudgeGuard)
  getJudgeState(@Req() req: any) {
    return this.scoresService.getJudgeState(req.user.judgeId);
  }

  @Post('judge/submit')
  @UseGuards(JudgeGuard)
  @HttpCode(200)
  submit(@Req() req: any, @Body() dto: SubmitScoreDto) {
    return this.scoresService.submit(req.user.judgeId, dto);
  }

  @Get('admin/:eventId')
  @UseGuards(AdminGuard)
  getAdminScores(@Param('eventId') eventId: string) {
    return this.scoresService.getAdminScores(eventId);
  }

  @Put('admin/:id')
  @UseGuards(AdminGuard)
  adminUpdate(@Param('id') id: string, @Body() body: { values: Record<string, number>; comment: string }) {
    return this.scoresService.adminUpdate(id, body.values, body.comment);
  }

  @Delete('admin/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  adminDelete(@Param('id') id: string) {
    return this.scoresService.adminDelete(id);
  }

  @Delete('admin/event/:eventId/reset')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  resetEventScores(@Param('eventId') eventId: string) {
    return this.scoresService.resetEventScores(eventId);
  }
}
