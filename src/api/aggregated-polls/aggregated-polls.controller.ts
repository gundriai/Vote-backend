import { Controller, Get, Query, Param, Headers, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AggregatedPollsService } from './aggregated-polls.service';
import { AggregatedPollsResponse, AggregatedPoll } from './dto/aggregated-poll.dto';

@Controller('api/aggregated-polls')
export class AggregatedPollsController {
  private readonly logger = new Logger(AggregatedPollsController.name);

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
    this.logger.log(`Getting aggregated polls${category ? ` for category: ${category}` : ''}`);
    const userId = this.extractUserIdFromToken(authorization);
    this.logger.log(`User ID extracted: ${userId || 'anonymous'}`);
    return this.aggregatedPollsService.getAggregatedPolls(category, userId);
  }

  @Get('category/:category')
  async getAggregatedPollsByCategory(
    @Param('category') category: string,
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPollsResponse> {
    this.logger.log(`Getting aggregated polls for category: ${category}`);
    const userId = this.extractUserIdFromToken(authorization);
    this.logger.log(`User ID extracted: ${userId || 'anonymous'}`);
    return this.aggregatedPollsService.getAggregatedPolls(category, userId);
  }

  @Get('admin/all')
  async getAllAggregatedPollsForAdmin(
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPollsResponse> {
    this.logger.log('Getting all aggregated polls for admin');
    const userId = this.extractUserIdFromToken(authorization);
    this.logger.log(`Admin user ID: ${userId}`);
    return this.aggregatedPollsService.getAllAggregatedPollsForAdmin(userId);
  }

  @Get(':id')
  async getAggregatedPollById(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string
  ): Promise<AggregatedPoll | null> {
    this.logger.log(`Getting aggregated poll by ID: ${id}`);
    const userId = this.extractUserIdFromToken(authorization);
    this.logger.log(`User ID extracted: ${userId || 'anonymous'}`);
    return this.aggregatedPollsService.getAggregatedPollById(id, userId);
  }
}
