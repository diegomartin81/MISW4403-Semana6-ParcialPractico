import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { AerolineaModule } from 'src/aerolinea/aerolinea.module';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  providers: [AeropuertoService],
  controllers: [AeropuertoController]
})
export class AeropuertoModule {}
