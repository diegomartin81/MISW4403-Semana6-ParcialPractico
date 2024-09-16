import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AeropuertoModule } from 'src/aeropuerto/aeropuerto.module';
import { AerolineaController } from './aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  providers: [AerolineaService],
  controllers: [AerolineaController]
})
export class AerolineaModule {}
