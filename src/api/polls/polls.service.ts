import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Polls } from '../../entities/poll.entity';
import { Candidate } from '../../entities/candidate.entity';
import { PollOption } from '../../entities/pollOption.entity';
import { Vote } from '../../entities/vote.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CreateComprehensivePollDto } from './dto/create-comprehensive-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Polls)
    private pollsRepository: Repository<Polls>,
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
  ) { }

  async create(createPollDto: CreatePollDto): Promise<Polls> {
    const poll = this.pollsRepository.create({
      ...createPollDto,
      startDate: new Date(createPollDto.startDate),
      endDate: new Date(createPollDto.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: createPollDto.isHidden || false,
      category: createPollDto.category || [],
    });
    return await this.pollsRepository.save(poll);
  }

  async findAll(): Promise<Polls[]> {
    return await this.pollsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findVisible(): Promise<Polls[]> {
    return await this.pollsRepository.find({
      where: { isHidden: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Polls[]> {
    const now = new Date();
    return await this.pollsRepository
      .createQueryBuilder('poll')
      .where('poll.startDate <= :now', { now })
      .andWhere('poll.endDate >= :now', { now })
      .andWhere('poll.isHidden = :isHidden', { isHidden: false })
      .orderBy('poll.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Polls> {
    const poll = await this.pollsRepository.findOne({ where: { id } });
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }
    return poll;
  }

  async update(id: string, updatePollDto: UpdatePollDto): Promise<Polls> {
    const poll = await this.findOne(id);

    const updateData: any = { ...updatePollDto };

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Handle candidates update
    if (updateData.candidates && Array.isArray(updateData.candidates)) {
      for (const candidateData of updateData.candidates) {
        if (candidateData.id) {
          await this.candidatesRepository.update(candidateData.id, {
            ...(candidateData.name && { name: candidateData.name }),
            ...(candidateData.description && { description: candidateData.description }),
            ...(candidateData.imageUrl && { photo: candidateData.imageUrl }),
          });
        }
      }
      // Remove candidates from updateData as it's not a column in Polls entity
      delete updateData.candidates;
    }

    updateData.updatedAt = new Date();

    Object.assign(poll, updateData);
    return await this.pollsRepository.save(poll);
  }

  async remove(id: string): Promise<void> {
    // Start a transaction to ensure all-or-nothing deletion
    const queryRunner = this.pollsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First, verify the poll exists
      const poll = await queryRunner.manager.findOne(Polls, { where: { id } });
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      // 1. Delete all votes for this poll
      const votesDeleted = await queryRunner.manager.delete(Vote, { pollId: id });
      console.log(`Deleted ${votesDeleted.affected || 0} votes for poll ${id}`);

      // 2. Delete all poll options for this poll
      const optionsDeleted = await queryRunner.manager.delete(PollOption, { pollId: id });
      console.log(`Deleted ${optionsDeleted.affected || 0} poll options for poll ${id}`);

      // 3. Finally, delete the poll itself
      const pollDeleted = await queryRunner.manager.delete(Polls, { id });
      console.log(`Deleted poll ${id}`);

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback the transaction on error
      await queryRunner.rollbackTransaction();
      console.error('Error deleting poll:', error);
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findByType(type: string): Promise<Polls[]> {
    return await this.pollsRepository.find({
      where: { type: type as any },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Polls[]> {
    return await this.pollsRepository
      .createQueryBuilder('poll')
      .where('poll.category @> :category', { category: [category] })
      .andWhere('poll.isHidden = :isHidden', { isHidden: false })
      .orderBy('poll.createdAt', 'DESC')
      .getMany();
  }

  async findExpired(): Promise<Polls[]> {
    const now = new Date();
    return await this.pollsRepository
      .createQueryBuilder('poll')
      .where('poll.endDate < :now', { now })
      .andWhere('poll.isHidden = :isHidden', { isHidden: false })
      .orderBy('poll.endDate', 'DESC')
      .getMany();
  }

  async findHidden(): Promise<Polls[]> {
    return await this.pollsRepository.find({
      where: { isHidden: true },
      order: { createdAt: 'DESC' },
    });
  }

  async toggleVisibility(id: string): Promise<Polls> {
    const poll = await this.findOne(id);
    poll.isHidden = !poll.isHidden;
    poll.updatedAt = new Date();
    return await this.pollsRepository.save(poll);
  }

  async createComprehensive(createComprehensivePollDto: CreateComprehensivePollDto): Promise<Polls> {
    // Start a transaction to ensure all-or-nothing creation
    const queryRunner = this.pollsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the poll
      const poll = this.pollsRepository.create({
        title: createComprehensivePollDto.title,
        description: createComprehensivePollDto.description,
        type: createComprehensivePollDto.type,
        category: createComprehensivePollDto.category || [],
        startDate: new Date(createComprehensivePollDto.startDate),
        endDate: new Date(createComprehensivePollDto.endDate),
        mediaUrl: createComprehensivePollDto.mediaUrl || '',
        createdBy: createComprehensivePollDto.createdBy || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: createComprehensivePollDto.isHidden || false,
        comments: createComprehensivePollDto.comments || [],
      });

      const savedPoll = await queryRunner.manager.save(Polls, poll);

      // 2. Create candidates if provided (for ONE_VS_ONE polls)
      if (createComprehensivePollDto.candidates && createComprehensivePollDto.candidates.length > 0) {
        const candidates = createComprehensivePollDto.candidates.map(candidateData => {
          const candidate = this.candidatesRepository.create({
            name: candidateData.name,
            description: candidateData.description || '',
            photo: candidateData.imageUrl || '',
          });
          return candidate;
        });

        const savedCandidates = await queryRunner.manager.save(Candidate, candidates);

        // 3. Create poll options for candidates
        const pollOptions = savedCandidates.map(candidate => {
          const pollOption = this.pollOptionsRepository.create({
            pollId: savedPoll.id,
            candidateId: candidate.id,
            label: candidate.name,
          });
          return pollOption;
        });

        await queryRunner.manager.save(PollOption, pollOptions);
      }

      // 4. Create poll options for vote options (for REACTION_BASED polls)
      if (createComprehensivePollDto.voteOptions && createComprehensivePollDto.voteOptions.length > 0) {
        const pollOptions = createComprehensivePollDto.voteOptions.map(voteOption => {
          const pollOption = this.pollOptionsRepository.create({
            pollId: savedPoll.id,
            label: voteOption.label,
            type: voteOption.type, // Save the type field
            icon: voteOption.icon,
            color: voteOption.color,
          });
          return pollOption;
        });

        await queryRunner.manager.save(PollOption, pollOptions);
      }

      // 5. Commit the transaction
      await queryRunner.commitTransaction();

      // 6. Return the created poll with all relations
      return await this.findOne(savedPoll.id);

    } catch (error) {
      // Rollback the transaction on error
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to create comprehensive poll: ${error.message}`);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
