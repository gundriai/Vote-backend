import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../../entities/vote.entity';
import { Polls } from '../../entities/poll.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    @InjectRepository(Polls)
    private pollsRepository: Repository<Polls>,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    // Check if poll is active
    const poll = await this.pollsRepository.findOne({ 
      where: { id: createVoteDto.pollId } 
    });
    
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${createVoteDto.pollId} not found`);
    }

    const now = new Date();
    if (now < poll.startDate || now > poll.endDate) {
      throw new BadRequestException('Poll is not active');
    }

    // Check if user has already voted in this poll
    const existingVote = await this.votesRepository.findOne({
      where: {
        pollId: createVoteDto.pollId,
        userId: createVoteDto.userId,
      },
    });

    if (existingVote) {
      throw new BadRequestException('Already Voted.');
    }

    const vote = this.votesRepository.create({
      pollId: createVoteDto.pollId,
      optionId: createVoteDto.optionId,
      userId: createVoteDto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.votesRepository.save(vote);
  }

  async findAll(): Promise<Vote[]> {
    return await this.votesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vote> {
    const vote = await this.votesRepository.findOne({ 
      where: { id },
    });
    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }
    return vote;
  }

  async findByPollId(pollId: string): Promise<Vote[]> {
    return await this.votesRepository.find({
      where: { pollId: pollId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByUserId(userId: string): Promise<Vote[]> {
    return await this.votesRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateVoteDto: UpdateVoteDto): Promise<Vote> {
    const vote = await this.findOne(id);
    const updateData: any = { ...updateVoteDto };
    updateData.updatedAt = new Date();
    Object.assign(vote, updateData);
    return await this.votesRepository.save(vote);
  }

  async remove(id: string): Promise<void> {
    const vote = await this.findOne(id);
    await this.votesRepository.remove(vote);
  }

  async getVoteCountByPollId(pollId: string): Promise<number> {
    return await this.votesRepository.count({
      where: { pollId: pollId },
    });
  }

  async getVoteCountByOptionId(optionId: string): Promise<number> {
    return await this.votesRepository.count({
      where: { optionId: optionId },
    });
  }

  async getVoteStatistics(pollId: string): Promise<any> {
    const votes = await this.findByPollId(pollId);
    const totalVotes = votes.length;
    
    const optionCounts = {};
    votes.forEach(vote => {
      const optionId = vote.optionId;
      optionCounts[optionId] = (optionCounts[optionId] || 0) + 1;
    });

    return {
      totalVotes,
      optionCounts,
      percentages: Object.keys(optionCounts).reduce((acc, optionId) => {
        acc[optionId] = totalVotes > 0 ? (optionCounts[optionId] / totalVotes) * 100 : 0;
        return acc;
      }, {}),
    };
  }
}
