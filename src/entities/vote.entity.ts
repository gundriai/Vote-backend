import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Polls } from "./poll.entity";
import { UUID } from "crypto";
import { PollOption } from "./pollOption.entity";
import { User } from "src/users/user.entity";

export class Vote {
    @PrimaryGeneratedColumn()
    id:UUID;

    @Column()
    pollId:Polls;

    @Column()
    optionId:PollOption;

    @Column()
    userId:User;

    @Column()
    createdAt:Date;

    @Column()
    updatedAt:Date;
}