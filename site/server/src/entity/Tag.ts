import {PrimaryGeneratedColumn, Column, Entity, Unique, ManyToMany} from 'typeorm';
import {Gallery} from './Gallery';

@Unique(['name'])
@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name'})
    name: string;

    @ManyToMany(type => Gallery, gallery => gallery.tags)
    gallery: Gallery[];
}
