import { Module } from '@nestjs/common';
import { PollsModule } from './polls/polls.module';
import { CandidatesModule } from './candidates/candidates.module';
import { PollOptionsModule } from './poll-options/poll-options.module';
import { VotesModule } from './votes/votes.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    PollsModule,
    CandidatesModule,
    PollOptionsModule,
    VotesModule,
    BannersModule,
  ],
  exports: [
    PollsModule,
    CandidatesModule,
    PollOptionsModule,
    VotesModule,
    BannersModule,
  ],
})
export class ApiModule {}
