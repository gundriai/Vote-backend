import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AggregatedPollsController } from './aggregated-polls.controller';
import { AggregatedPollsService } from './aggregated-polls.service';
import { Polls } from '../../entities/poll.entity';
import { Candidate } from '../../entities/candidate.entity';
import { PollOption } from '../../entities/pollOption.entity';
import { Vote } from '../../entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Polls, Candidate, PollOption, Vote]),
    JwtModule.register({})
  ],
  controllers: [AggregatedPollsController],
  providers: [AggregatedPollsService],
  exports: [AggregatedPollsService],
})
export class AggregatedPollsModule {}
