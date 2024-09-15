import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CoberturaService } from './cobertura.service';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';

@Controller('airlines/:aerolineaId/airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class CoberturaController {
    constructor(private readonly coberturaService: CoberturaService){}

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.coberturaService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string){
       return await this.coberturaService.findAirportsFromAirline(aerolineaId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.coberturaService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Put(':aerolineaId/aeropuertos')
    async updateAirportsFromAirline(@Body() aeropuertoDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string){
       const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertoDto)
       return await this.coberturaService.updateAirportsFromAirline(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.coberturaService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
}
