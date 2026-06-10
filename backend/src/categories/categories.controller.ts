import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('judge')
  findAllJudge() {
    return this.categoriesService.findAllJudge();
  }

  @Get('guest')
  findAllGuest() {
    return this.categoriesService.findAllGuest();
  }

  @Post('judge')
  @UseGuards(AdminGuard)
  createJudge(@Body() body: { name: string }) {
    return this.categoriesService.createJudge(body.name);
  }

  @Post('guest')
  @UseGuards(AdminGuard)
  createGuest(@Body() body: { name: string }) {
    return this.categoriesService.createGuest(body.name);
  }

  @Put('judge/:id')
  @UseGuards(AdminGuard)
  updateJudge(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoriesService.updateJudge(id, body.name);
  }

  @Put('guest/:id')
  @UseGuards(AdminGuard)
  updateGuest(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoriesService.updateGuest(id, body.name);
  }

  @Delete('judge/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeJudge(@Param('id') id: string) {
    return this.categoriesService.removeJudge(id);
  }

  @Delete('guest/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeGuest(@Param('id') id: string) {
    return this.categoriesService.removeGuest(id);
  }
}
