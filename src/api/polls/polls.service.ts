import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Polls } from '../../entities/poll.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Polls)
    private pollsRepository: Repository<Polls>,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Polls> {
    const poll = this.pollsRepository.create({
      ...createPollDto,
      startDate: new Date(createPollDto.startDate),
      endDate: new Date(createPollDto.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: createPollDto.isHidden || false,
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
    
    updateData.updatedAt = new Date();
    
    Object.assign(poll, updateData);
    return await this.pollsRepository.save(poll);
  }

  async remove(id: string): Promise<void> {
    const poll = await this.findOne(id);
    await this.pollsRepository.remove(poll);
  }

  async findByType(type: string): Promise<Polls[]> {
    return await this.pollsRepository.find({
      where: { type: type as any },
      order: { createdAt: 'DESC' },
    });
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
}
