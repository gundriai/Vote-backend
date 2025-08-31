import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    pollId: number;

    @Column({ type: 'uuid' })
    optionId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}