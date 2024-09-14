import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { CoberturaModule } from './cobertura/cobertura.module';

@Module({
  imports: [AeropuertoModule, AerolineaModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'aerolinea',
    entities: [AerolineaEntity, AeropuertoEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }), CoberturaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
