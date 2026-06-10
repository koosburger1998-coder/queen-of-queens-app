import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Post(':id/activate')
  @UseGuards(AdminGuard)
  @HttpCode(200)
  activate(@Param('id') id: string) {
    return this.eventsService.activate(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/contestants')
  @UseGuards(AdminGuard)
  addContestant(@Param('id') id: string, @Body() body: { contestantId: string }) {
    return this.eventsService.addContestant(id, body.contestantId);
  }

  @Delete(':id/contestants/:contestantId')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeContestant(@Param('id') id: string, @Param('contestantId') contestantId: string) {
    return this.eventsService.removeContestant(id, contestantId);
  }

  @Post(':id/judges')
  @UseGuards(AdminGuard)
  addJudge(@Param('id') id: string, @Body() body: { judgeId: string }) {
    return this.eventsService.addJudge(id, body.judgeId);
  }

  @Delete(':id/judges/:judgeId')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeJudge(@Param('id') id: string, @Param('judgeId') judgeId: string) {
    return this.eventsService.removeJudge(id, judgeId);
  }
}
