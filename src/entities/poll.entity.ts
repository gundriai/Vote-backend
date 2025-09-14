import { PollType } from "src/types/enums";
import { PollCategories } from "src/types/enums";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('polls')
export class Polls {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;


  @Column({type:'enum',enum:PollType})
  type:PollType;

  @Column({
    type: 'enum',
    enum: PollCategories,
    array: true,
    nullable: true
  })
  category: PollCategories[];

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

  constructor(partial?: Partial<Polls>) {
      if (partial) {
          Object.assign(this, partial);
      }
  }
}