import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Admin)
        private adminRepo: Repository<Admin>,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    /**
     * Seeds the admin email in the admins table if not present.
     */
    async seedAdmin() {
        const email = process.env.ROOT_ADMIN_EMAIL;
        if (!email) {
            console.warn('❗ ROOT_ADMIN_EMAIL missing in .env');
            return;
        }
        const existingAdmin = await this.adminRepo.findOne({ where: { email } });
        if (existingAdmin) {
            console.log(`✅ Admin already exists with email: ${email}`);
            return;
        }
        const admin = this.adminRepo.create({ email });
        await this.adminRepo.save(admin);
        console.log(`Admin seeded, email: ${email}`);
    }
}
