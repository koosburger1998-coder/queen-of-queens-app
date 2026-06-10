import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ContestantsService } from './contestants.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { UpdateContestantDto } from './dto/update-contestant.dto';

@Controller('api/contestants')
@UseGuards(AdminGuard)
export class ContestantsController {
  constructor(private readonly contestantsService: ContestantsService) {}

  @Get()
  findAll() {
    return this.contestantsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateContestantDto) {
    return this.contestantsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContestantDto) {
    return this.contestantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.contestantsService.remove(id);
  }
}
