import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import {Tag} from './Tag';

// tslint:disable:variable-name

@Entity()
export class Gallery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gid: number;

    @Column()
    token: string;

    @Column()
    archiver_key: string;

    @Column({length: 5120, charset: 'utf8mb4'})
    title: string;

    @Column({length: 5120, charset: 'utf32'})
    title_jpn: string;

    @Column()
    category: string;

    @Column()
    thumb: string;

    @Column()
    uploader: string;

    @Column()
    posted: string;

    @Column()
    filecount: string;

    @Column()
    filesize: number;

    @Column()
    expunged: boolean;

    @Column()
    rating: string;

    @Column()
    torrentcount: string;

    @ManyToMany(type => Tag, tag => tag.gallery)
    @JoinTable()
    tags: Tag[];
}
