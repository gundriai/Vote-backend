import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Index({ unique: true })
  @Column()
  provider!: 'google' | 'facebook';

  @Index()
  @Column()
  providerId!: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ default: () => new Date() })
  createdAt!: Date;

  @Column({ default: () => new Date() })
  updatedAt!: Date;
}


