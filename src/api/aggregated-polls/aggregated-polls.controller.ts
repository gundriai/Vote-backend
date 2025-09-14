import { Controller, Get, Query, Param } from '@nestjs/common';
import { AggregatedPollsService } from './aggregated-polls.service';
import { AggregatedPollsResponse, AggregatedPoll } from './dto/aggregated-poll.dto';

@Controller('api/aggregated-polls')
export class AggregatedPollsController {
  constructor(private readonly aggregatedPollsService: AggregatedPollsService) {}

  @Get()
  async getAggregatedPolls(
    @Query('category') category?: string
  ): Promise<AggregatedPollsResponse> {
    return this.aggregatedPollsService.getAggregatedPolls(category);
  }

  @Get('category/:category')
  async getAggregatedPollsByCategory(
    @Param('category') category: string
  ): Promise<AggregatedPollsResponse> {
    return this.aggregatedPollsService.getAggregatedPolls(category);
  }

  @Get(':id')
  async getAggregatedPollById(
    @Param('id') id: string
  ): Promise<AggregatedPoll | null> {
    return this.aggregatedPollsService.getAggregatedPollById(id);
  }
}
