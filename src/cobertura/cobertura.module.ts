import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaService } from 'src/aerolinea/aerolinea.service';
import { AeropuertoService } from 'src/aeropuerto/aeropuerto.service';
import { CoberturaService } from './cobertura.service';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineaService, AeropuertoService, CoberturaService]
})
export class CoberturaModule {}
