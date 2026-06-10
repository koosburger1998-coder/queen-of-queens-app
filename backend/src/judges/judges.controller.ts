import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { JudgesService } from './judges.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';

@Controller('api/judges')
@UseGuards(AdminGuard)
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateJudgeDto) {
    return this.judgesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJudgeDto) {
    return this.judgesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.judgesService.remove(id);
  }
}
