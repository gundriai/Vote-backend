import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PollOptionsService } from './poll-options.service';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../types/enums';

@Controller('api/poll-options')
export class PollOptionsController {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  create(@Body() createPollOptionDto: CreatePollOptionDto) {
    return this.pollOptionsService.create(createPollOptionDto);
  }

  @Get()
  findAll() {
    return this.pollOptionsService.findAll();
  }

  @Get('poll/:pollId')
  findByPollId(@Param('pollId') pollId: string) {
    return this.pollOptionsService.findByPollId(pollId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollOptionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  update(@Param('id') id: string, @Body() updatePollOptionDto: UpdatePollOptionDto) {
    return this.pollOptionsService.update(id, updatePollOptionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  remove(@Param('id') id: string) {
    return this.pollOptionsService.remove(id);
  }

  @Delete('poll/:pollId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  removeByPollId(@Param('pollId') pollId: string) {
    return this.pollOptionsService.removeByPollId(pollId);
  }
}
