import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./candidate.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

import { Polls } from "./poll.entity";

@Entity('pollOption')
export class PollOption{

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    pollId: string;

    @ManyToOne(() => Polls)
    @JoinColumn({ name: 'pollId' })
    poll: Polls;

    @Column({nullable: true})
    label?: string;

    @Column({nullable: true})
    icon?: string;

    @Column({nullable: true})
    color?: string;

    @Column({ type: 'uuid', nullable: true })
    candidateId?: string;

    @ManyToOne(() => Candidate, { nullable: true })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    constructor(partial?: Partial<PollOption>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}