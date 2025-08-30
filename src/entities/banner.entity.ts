import { UUID } from "crypto";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";

@Entity('banner')
export class Banner {
    @PrimaryGeneratedColumn()
    id:UUID;

    @Column()
    image:string;

    @Column()
    title:string;

    @Column()
    subTitle:string;

    @Column()
    button:BannerButton;

}

export class BannerButton{
    @Column()
    label:string;

    @Column()
    url:string;

}