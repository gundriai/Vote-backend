import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Polls } from '../../entities/poll.entity';
import { Candidate } from '../../entities/candidate.entity';
import { PollOption } from '../../entities/pollOption.entity';
import { Vote } from '../../entities/vote.entity';
import { PollType } from '../../types/enums';
import { 
  AggregatedPoll, 
  AggregatedComment, 
  AggregatedCandidate, 
  AggregatedPollOption,
  AggregatedPollsResponse 
} from './dto/aggregated-poll.dto';
import { PollCategories } from '../../types/enums';

@Injectable()
export class AggregatedPollsService {
  constructor(
    @InjectRepository(Polls)
    private pollsRepository: Repository<Polls>,
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async getAggregatedPolls(category?: string, userId?: string): Promise<AggregatedPollsResponse> {
    // Get all visible polls
    let pollsQuery = this.pollsRepository
      .createQueryBuilder('poll')
      .where('poll.isHidden = :isHidden', { isHidden: false });

    // Filter by category if provided
    if (category && category !== 'All') {
      pollsQuery = pollsQuery.andWhere('poll.category @> :category', { category: [category] });
    }

    const polls = await pollsQuery
      .orderBy('poll.createdAt', 'DESC')
      .getMany();

    // Aggregate data for each poll
    const aggregatedPolls: AggregatedPoll[] = [];

    for (const poll of polls) {
      const aggregatedPoll = await this.aggregatePollData(poll, userId);
      aggregatedPolls.push(aggregatedPoll);
    }

    // Calculate summary statistics
    const totalVotes = aggregatedPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);
    const totalComments = aggregatedPolls.reduce((sum, poll) => sum + poll.totalComments, 0);

    // Count polls by category
    const categories: { [key: string]: number } = {};
    aggregatedPolls.forEach(poll => {
      poll.category.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    // Count polls by type
    const types: { [key: string]: number } = {};
    aggregatedPolls.forEach(poll => {
      types[poll.type] = (types[poll.type] || 0) + 1;
    });

    return {
      polls: aggregatedPolls,
      totalPolls: aggregatedPolls.length,
      totalVotes,
      totalComments,
      categories,
      types,
    };
  }

  private async aggregatePollData(poll: Polls, userId?: string): Promise<AggregatedPoll> {
    // Get poll options for this poll
    const pollOptions = await this.pollOptionsRepository.find({
      where: { pollId: poll.id },
    });

    // Get votes for this poll
    const votes = await this.votesRepository.find({
      where: { pollId: poll.id },
    });

    // Get candidates for this poll
    const candidateIds = pollOptions
      .filter(option => option.candidateId)
      .map(option => option.candidateId);

    const candidates = candidateIds.length > 0 
      ? await this.candidatesRepository.findByIds(candidateIds)
      : [];

    // Aggregate candidates with vote counts
    const aggregatedCandidates: AggregatedCandidate[] = candidates.map(candidate => {
      const candidateOptions = pollOptions.filter(option => option.candidateId === candidate.id);
      const candidateVotes = votes.filter(vote => 
        candidateOptions.some(option => option.id === vote.optionId)
      );
      
      return {
        id: candidate.id,
        pollId: poll.id,
        name: candidate.name,
        description: candidate.description,
        imageUrl: candidate.photo,
        voteCount: candidateVotes.length,
      };
    });

    // Aggregate poll options with vote counts
    const aggregatedPollOptions: AggregatedPollOption[] = pollOptions.map(option => {
      const optionVotes = votes.filter(vote => vote.optionId === option.id);
      return {
        id: option.id,
        pollId: poll.id,
        label: option.label,
        type: option.type,
        icon: option.icon,
        color: option.color,
        candidateId: option.candidateId,
        voteCount: optionVotes.length,
      };
    });

    // Calculate vote counts for reaction-based polls
    const voteCounts: { [key: string]: number } = {};
    if (poll.type === PollType.REACTION_BASED) {
      // For reaction-based polls, count votes by option type
      pollOptions.forEach(option => {
        const optionVotes = votes.filter(vote => vote.optionId === option.id);
        voteCounts[option.type || option.label || 'unknown'] = optionVotes.length;
      });
    }

    // Parse comments from JSONB
    const comments: AggregatedComment[] = poll.comments ? 
      (Array.isArray(poll.comments) ? poll.comments : []) : [];

    // Calculate totals
    const totalVotes = votes.length;
    const totalComments = comments.length;

    // Check if user has already voted on this poll and get the option they chose
    let votedDetails = { alreadyVoted: false, optionChosen: undefined };
    if (userId) {
      const userVote = await this.votesRepository.findOne({
        where: {
          pollId: poll.id,
          userId: userId,
        },
      });
      
      if (userVote) {
        // For reaction-based polls, we need to find the poll option to get the type
        if (poll.type === 'REACTION_BASED') {
          const pollOption = await this.pollOptionsRepository.findOne({
            where: { id: userVote.optionId }
          });
          votedDetails = {
            alreadyVoted: true,
            optionChosen: pollOption?.type || pollOption?.label || userVote.optionId
          };
        } else {
          // For comparison polls, we can use the optionId directly
          votedDetails = {
            alreadyVoted: true,
            optionChosen: userVote.optionId
          };
        }
      }
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      type: poll.type as any,
      category: poll.category || [],
      mediaUrl: poll.mediaUrl,
      startDate: poll.startDate,
      endDate: poll.endDate,
      isHidden: poll.isHidden,
      comments: comments.map(comment => ({
        id: comment.id || '',
        pollId: poll.id,
        content: comment.content || '',
        author: comment.author || '',
        createdAt: comment.createdAt || new Date().toISOString(),
        gajjabCount: comment.gajjabCount || 0,
        bekarCount: comment.bekarCount || 0,
        furiousCount: comment.furiousCount || 0,
      })),
      updatedAt: poll.updatedAt,
      createdBy: poll.createdBy || '',
      createdAt: poll.createdAt,
      candidates: aggregatedCandidates,
      pollOptions: aggregatedPollOptions,
      voteCounts: Object.keys(voteCounts).length > 0 ? voteCounts : undefined,
      totalComments,
      totalVotes,
      votedDetails,
    };
  }

  async getAggregatedPollById(id: string, userId?: string): Promise<AggregatedPoll | null> {
    const poll = await this.pollsRepository.findOne({ where: { id } });
    if (!poll) {
      return null;
    }

    return this.aggregatePollData(poll, userId);
  }

  async getAllAggregatedPollsForAdmin(userId?: string): Promise<AggregatedPollsResponse> {
    // Get ALL polls (including hidden ones) for admin
    const polls = await this.pollsRepository
      .createQueryBuilder('poll')
      .orderBy('poll.createdAt', 'DESC')
      .getMany();

    // Aggregate data for each poll
    const aggregatedPolls: AggregatedPoll[] = [];

    for (const poll of polls) {
      const aggregatedPoll = await this.aggregatePollData(poll, userId);
      aggregatedPolls.push(aggregatedPoll);
    }

    // Calculate summary statistics
    const totalVotes = aggregatedPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);
    const totalComments = aggregatedPolls.reduce((sum, poll) => sum + poll.totalComments, 0);

    // Get categories and types with counts for response
    const categories: { [key: string]: number } = {};
    const types: { [key: string]: number } = {};

    aggregatedPolls.forEach(poll => {
      poll.category.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
      types[poll.type] = (types[poll.type] || 0) + 1;
    });

    return {
      polls: aggregatedPolls,
      totalPolls: aggregatedPolls.length,
      totalVotes,
      totalComments,
      categories,
      types,
    };
  }
}
