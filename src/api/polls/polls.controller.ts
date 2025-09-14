import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CreateComprehensivePollDto } from './dto/create-comprehensive-poll.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../types/enums';

@Controller('api/polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }

  @Post('comprehensive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  createComprehensive(@Body() createComprehensivePollDto: CreateComprehensivePollDto) {
    return this.pollsService.createComprehensive(createComprehensivePollDto);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.pollsService.findActive();
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.pollsService.findByType(type);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.pollsService.findByCategory(category);
  }

  @Get('expired')
  findExpired() {
    return this.pollsService.findExpired();
  }

  @Get('hidden')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  findHidden() {
    return this.pollsService.findHidden();
  }

  @Get('visible')
  findVisible() {
    return this.pollsService.findVisible();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  toggleVisibility(@Param('id') id: string) {
    return this.pollsService.toggleVisibility(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}
