import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOptionsService } from './poll-options.service';
import { PollOptionsController } from './poll-options.controller';
import { PollOption } from '../../entities/pollOption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption])],
  controllers: [PollOptionsController],
  providers: [PollOptionsService],
  exports: [PollOptionsService],
})
export class PollOptionsModule {}
