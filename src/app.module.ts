import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Admin } from './entities/admin.entity';
import { SeederModule } from './seeder/seeder.module';
import { ApiModule } from './api/api.module';
import { AggregatedPollsModule } from './api/aggregated-polls/aggregated-polls.module';
import { Polls } from './entities/poll.entity';
import { Candidate } from './entities/candidate.entity';
import { PollOption } from './entities/pollOption.entity';
import { Vote } from './entities/vote.entity';
import { Banner } from './entities/banner.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 5432,
        username: config.get<string>('DB_USERNAME') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || 'postgres',
        database: config.get<string>('DB_NAME') || 'vote_backend',
        entities: [User, Admin, Polls, Candidate, PollOption, Vote, Banner],
        synchronize: true,
        logging: true,
        ssl: { rejectUnauthorized: false }
      }),
    }),
    AuthModule,
    SeederModule,
    ApiModule,
    AggregatedPollsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
