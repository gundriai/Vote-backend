import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../types/enums';

@Controller('api/votes')
export class VotesController {
  private readonly logger = new Logger(VotesController.name);

  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVoteDto: CreateVoteDto) {
    this.logger.log('Creating new vote');
    return this.votesService.create(createVoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  findAll() {
    return this.votesService.findAll();
  }

  @Get('poll/:pollId')
  findByPollId(@Param('pollId') pollId: string) {
    this.logger.log(`Getting votes for poll: ${pollId}`);
    return this.votesService.findByPollId(pollId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId') userId: string) {
    return this.votesService.findByUserId(userId);
  }

  @Get('statistics/:pollId')
  getVoteStatistics(@Param('pollId') pollId: string) {
    return this.votesService.getVoteStatistics(pollId);
  }

  @Get('count/poll/:pollId')
  getVoteCountByPollId(@Param('pollId') pollId: string) {
    return this.votesService.getVoteCountByPollId(pollId);
  }

  @Get('count/option/:optionId')
  getVoteCountByOptionId(@Param('optionId') optionId: string) {
    return this.votesService.getVoteCountByOptionId(optionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(id, updateVoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_USER)
  remove(@Param('id') id: string) {
    return this.votesService.remove(id);
  }
}
