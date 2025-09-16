import { Controller, Get, Query, Param, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AggregatedPollsService } from './aggregated-polls.service';
import { AggregatedPollsResponse, AggregatedPoll } from './dto/aggregated-poll.dto';

@Controller('api/aggregated-polls')
export class AggregatedPollsController {
  constructor(
    private readonly aggregatedPollsService: AggregatedPollsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserIdFromToken(authorization?: string): string | undefined {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return undefined;
    }

    try {
      const token = authorization.substring(7); // Remove 'Bearer ' prefix
      const payload = this.jwtService.decode(token) as any;
      return payload?.sub || payload?.userId;
    } catch (error) {
      return undefined;
    }
  }

  @Get()
  async getAggregatedPolls(
    @Query('category') category?: string,
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPollsResponse> {
    const userId = this.extractUserIdFromToken(authorization);
    return this.aggregatedPollsService.getAggregatedPolls(category, userId);
  }

  @Get('category/:category')
  async getAggregatedPollsByCategory(
    @Param('category') category: string,
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPollsResponse> {
    const userId = this.extractUserIdFromToken(authorization);
    return this.aggregatedPollsService.getAggregatedPolls(category, userId);
  }

  @Get('admin/all')
  async getAllAggregatedPollsForAdmin(
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPollsResponse> {
    const userId = this.extractUserIdFromToken(authorization);
    return this.aggregatedPollsService.getAllAggregatedPollsForAdmin(userId);
  }

  @Get(':id')
  async getAggregatedPollById(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPoll | null> {
    const userId = this.extractUserIdFromToken(authorization);
    return this.aggregatedPollsService.getAggregatedPollById(id, userId);
  }
}
