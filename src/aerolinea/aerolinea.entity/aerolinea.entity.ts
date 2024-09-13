import { AeropuertoEntity } from "src/aeropuerto/aeropuerto.entity/aeropuerto.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolinea)
    aeropuerto: AeropuertoEntity[];
}
