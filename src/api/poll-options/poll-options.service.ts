import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from '../../entities/pollOption.entity';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
  ) {}

  async create(createPollOptionDto: CreatePollOptionDto): Promise<PollOption> {
    const pollOption = this.pollOptionsRepository.create({
      label: createPollOptionDto.label,
      pollId: createPollOptionDto.pollId,
      candidateId: createPollOptionDto.candidateId == null ? null : createPollOptionDto.candidateId
    });
    return await this.pollOptionsRepository.save(pollOption);
  }

  async findAll(): Promise<PollOption[]> {
    return await this.pollOptionsRepository.find({
      order: { label: 'ASC' },
      relations: ['candidate', 'poll'],
    });
  }

  async findOne(id: string): Promise<PollOption> {
    const pollOption = await this.pollOptionsRepository.findOne({ 
      where: { id },
      relations: ['candidate', 'poll'],
    });
    if (!pollOption) {
      throw new NotFoundException(`Poll option with ID ${id} not found`);
    }
    return pollOption;
  }

  async findByPollId(pollId: string): Promise<PollOption[]> {
    return await this.pollOptionsRepository.find({
      where: { pollId: pollId },
      relations: ['candidate', 'poll'],
    });
  }

  async update(id: string, updatePollOptionDto: UpdatePollOptionDto): Promise<PollOption> {
    const pollOption = await this.findOne(id);
    Object.assign(pollOption, updatePollOptionDto);
    return await this.pollOptionsRepository.save(pollOption);
  }

  async remove(id: string): Promise<void> {
    const pollOption = await this.findOne(id);
    await this.pollOptionsRepository.remove(pollOption);
  }

  async removeByPollId(pollId: string): Promise<void> {
    const pollOptions = await this.findByPollId(pollId);
    await this.pollOptionsRepository.remove(pollOptions);
  }

  async countByPollId(pollId: string): Promise<number> {
    return await this.pollOptionsRepository.count({
      where: { pollId: (pollId) },
    });
  }
}
