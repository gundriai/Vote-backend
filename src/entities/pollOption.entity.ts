import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Polls } from "./poll.entity";
import { Candidate } from "./candidate.entity";

@Entity('pollOption')
export class PollOption{

    @PrimaryGeneratedColumn()
    id:UUID;

    @Column()
    pollId:Polls;

    @Column()
    label:string;
    
    @Column()
    candidateId:Candidate;
    

}