import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async upsertSocialUser(params: {
    provider: 'google' | 'facebook';
    providerId: string;
    email?: string;
    name?: string;
    photo?: string;
  }): Promise<User> {
    const now = new Date();
    const existing = await this.usersRepository.findOne({
      where: { provider: params.provider, providerId: params.providerId },
    });

    if (existing) {
      existing.email = params.email ?? existing.email;
      existing.name = params.name ?? existing.name;
      existing.photo = params.photo ?? existing.photo;
      existing.updatedAt = now;
      return this.usersRepository.save(existing);
    }

    const user = this.usersRepository.create({
      provider: params.provider,
      providerId: params.providerId,
      email: params.email,
      name: params.name,
      photo: params.photo,
      createdAt: now,
      updatedAt: now,
    });
    return this.usersRepository.save(user);
  }
}


