import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Polls } from '../../entities/poll.entity';
import { Candidate } from '../../entities/candidate.entity';
import { PollOption } from '../../entities/pollOption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Polls, Candidate, PollOption])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService],
})
export class PollsModule {}
