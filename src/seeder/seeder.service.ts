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
     * Seeds the admin emails in the admins table if not present.
     */
    async seedAdmin() {
        const adminEmails = [
            process.env.ROOT_ADMIN_EMAIL,
            process.env.SECONDARY_ADMIN_EMAIL
        ].filter(email => email); // Remove undefined/null values

        if (adminEmails.length === 0) {
            console.warn('❗ No admin emails to seed');
            return;
        }

        for (const email of adminEmails) {
            const existingAdmin = await this.adminRepo.findOne({ where: { email } });
            if (existingAdmin) {
                console.log(`✅ Admin already exists with email: ${email}`);
                continue;
            }
            const admin = this.adminRepo.create({ email });
            await this.adminRepo.save(admin);
            console.log(`✅ Admin seeded, email: ${email}`);
        }
    }
}
