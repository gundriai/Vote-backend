import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Polls } from "./poll.entity";
import { PollOption } from "./pollOption.entity";
import { User } from "../users/user.entity";

@Entity('votes')
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({ type: 'uuid' })
    pollId: string;

    @ManyToOne(() => Polls)
    @JoinColumn({ name: 'pollId' })
    poll: Polls;


    @Column({ type: 'uuid' })
    optionId: string;

    @ManyToOne(() => PollOption)
    @JoinColumn({ name: 'optionId' })
    option: PollOption;


    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    constructor(partial?: Partial<Vote>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}