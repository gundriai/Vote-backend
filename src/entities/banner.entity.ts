
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity('banner')
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    image: string;

    @Column()
    title: string;

    @Column()
    subTitle: string;

    @Column()
    buttonLabel: string;

    @Column()
    buttonUrl: string;

    @Column({ default: true })
    isActive?: boolean;

    constructor(partial?: Partial<Banner>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
