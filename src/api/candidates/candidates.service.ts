import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../../entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidatesRepository.create(createCandidateDto);
    return await this.candidatesRepository.save(candidate);
  }

  async findAll(): Promise<Candidate[]> {
    return await this.candidatesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidatesRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
    return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.findOne(id);
    Object.assign(candidate, updateCandidateDto);
    return await this.candidatesRepository.save(candidate);
  }

  async remove(id: string): Promise<void> {
    const candidate = await this.findOne(id);
    await this.candidatesRepository.remove(candidate);
  }

  async findByName(name: string): Promise<Candidate[]> {
    return await this.candidatesRepository
      .createQueryBuilder('candidate')
      .where('LOWER(candidate.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .orderBy('candidate.name', 'ASC')
      .getMany();
  }

  async findByIds(ids: string[]): Promise<Candidate[]> {
    return await this.candidatesRepository.findByIds(ids);
  }
}
