import { PollType } from "src/types/enums";
import { User } from "src/users/user.entity";
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

  @Column()
  createdBy:User;

  @Column()
  createdAt:Date;

  @Column()
  updatedAt:Date;

  @Column()
  comments:JSON;

}