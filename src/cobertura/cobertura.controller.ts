import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CoberturaService } from './cobertura.service';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class CoberturaController {
    constructor(private readonly coberturaService: CoberturaService){}

    @Post(':airlineId/airports/:airportId')
    async addAirportToAirline(@Param('airlineId') aerolineaId: string, @Param('airportId') aeropuertoId: string){
       return await this.coberturaService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':airlineId/airports')
    async findAirportsFromAirline(@Param('airlineId') aerolineaId: string){
       return await this.coberturaService.findAirportsFromAirline(aerolineaId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAirportFromAirline(@Param('airlineId') aerolineaId: string, @Param('airportId') aeropuertoId: string){
       return await this.coberturaService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Put(':airlineId/airports')
    async updateAirportsFromAirline(@Body() aeropuertoDto: AeropuertoDto[], @Param('airlineId') aerolineaId: string){
       const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertoDto)
       return await this.coberturaService.updateAirportsFromAirline(aerolineaId, aeropuertos);
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('airlineId') aerolineaId: string, @Param('airportId') aeropuertoId: string){
       return await this.coberturaService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
}
