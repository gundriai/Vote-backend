import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn()
    id:UUID;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    photo:string;


}