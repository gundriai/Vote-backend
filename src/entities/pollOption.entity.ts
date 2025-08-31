import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Candidate } from "./candidate.entity";

@Entity('pollOption')
export class PollOption{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    pollId: number;

    @Column({ type: 'varchar' })
    label: string;
    
    @Column()
    candidateId?:Candidate;

}