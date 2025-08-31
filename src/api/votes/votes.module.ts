import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from '../../entities/vote.entity';
import { Polls } from '../../entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Polls])],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
