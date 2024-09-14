import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AeropuertoModule } from 'src/aeropuerto/aeropuerto.module';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity]), AeropuertoModule],
  providers: [AerolineaService]
})
export class AerolineaModule {}
