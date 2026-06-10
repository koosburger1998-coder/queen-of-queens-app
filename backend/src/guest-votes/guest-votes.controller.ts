import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { GuestVotesService } from './guest-votes.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SubmitGuestVoteDto } from './dto/submit-guest-vote.dto';

@Controller('api/audience')
export class GuestVotesController {
  constructor(private readonly guestVotesService: GuestVotesService) {}

  @Get('state')
  getState() {
    return this.guestVotesService.getState();
  }

  @Post('vote')
  @HttpCode(200)
  submit(@Body() dto: SubmitGuestVoteDto) {
    return this.guestVotesService.submit(dto);
  }

  @Get('admin/:eventId')
  @UseGuards(AdminGuard)
  getAdminVotes(@Param('eventId') eventId: string) {
    return this.guestVotesService.getAdminVotes(eventId);
  }

  @Delete('admin/event/:eventId/reset')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  resetEventVotes(@Param('eventId') eventId: string) {
    return this.guestVotesService.resetEventVotes(eventId);
  }
}
