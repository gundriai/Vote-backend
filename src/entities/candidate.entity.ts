import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PollOption } from "./pollOption.entity";

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    photo:string;

    constructor(partial?: Partial<Candidate>) {
            if (partial) {
                Object.assign(this, partial);
            }
        }
}