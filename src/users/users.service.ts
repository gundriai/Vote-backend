import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from 'src/types/enums';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
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
    // Determine role based on admin table
    let role = UserRole.NORMAL_USER;
    if (params.email) {
      const isAdmin = await this.adminsRepository.findOne({ where: { email: params.email } });
      if (isAdmin) {
        role = UserRole.ADMIN_USER;
      }
    }
    const user = this.usersRepository.create({
      provider: params.provider,
      providerId: params.providerId,
      email: params.email,
      name: params.name,
      photo: params.photo,
      role,
      createdAt: now,
      updatedAt: now,
    });
    return this.usersRepository.save(user);
  }
}


