import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Pokemon')
export class PokemonEntity {
    @PrimaryGeneratedColumn()
    @Generated('uuid')
    id: string;

    @Column()
    name: string;
    @Column()
    url: string;
}
