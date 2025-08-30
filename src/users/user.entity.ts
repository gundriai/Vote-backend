import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { UserRole } from '../types/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar' })
  provider!: 'google' | 'facebook';

  @Index()
  @Column({ type: 'varchar' })
  providerId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  @Column({type: 'enum', enum: UserRole})
  role?: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}


