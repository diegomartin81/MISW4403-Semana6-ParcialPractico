import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { AerolineaModule } from 'src/aerolinea/aerolinea.module';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity]), AerolineaModule],
  providers: [AeropuertoService]
})
export class AeropuertoModule {}
