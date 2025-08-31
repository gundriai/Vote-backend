import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannersRepository.create(createBannerDto);
    return await this.bannersRepository.save(banner);
  }

  async findAll(): Promise<Banner[]> {
    return await this.bannersRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findActive(): Promise<Banner[]> {
    // For now, return all banners. You can add logic to filter active banners
    return await this.bannersRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.findOne(id);
    Object.assign(banner, updateBannerDto);
    return await this.bannersRepository.save(banner);
  }

  async remove(id: string): Promise<void> {
    const banner = await this.findOne(id);
    await this.bannersRepository.remove(banner);
  }

  async reorderBanners(bannerIds: string[]): Promise<Banner[]> {
    const banners = [];
    for (let i = 0; i < bannerIds.length; i++) {
      const banner = await this.findOne(bannerIds[i]);
      banners.push(banner);
    }
    return banners;
  }
}
