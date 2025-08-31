import { PollType } from "src/types/enums";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('polls')
export class Polls {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({type:'enum',enum:PollType})
  type:PollType;

  @Column()
  startDate:Date;

  @Column()
  endDate:Date;

  @Column()
  mediaUrl:string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  comments: any;

  @Column({ default: false })
  isHidden: boolean;

}