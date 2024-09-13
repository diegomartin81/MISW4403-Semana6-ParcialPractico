import { AerolineaEntity } from "src/aerolinea/aerolinea.entity/aerolinea.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    fechaFundacion: string;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuerto)
    aerolinea: AerolineaEntity[];
}
