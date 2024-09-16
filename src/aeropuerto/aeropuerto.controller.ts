import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService){}

    @Get()
    async findAll() {
      return await this.aeropuertoService.findAll();
    }
  
    @Get(':airportId')
    async findOne(@Param('airportId') aeropuertoId: string) {
      return await this.aeropuertoService.findOne(aeropuertoId);
    }
  
    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.create(aeropuerto);
    }
  
    @Put(':airportId')
    async update(@Param('airportId') aeropuertoId: string, @Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.update(aeropuertoId, aeropuerto);
    }
  
    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') aeropuertoId: string) {
      return await this.aeropuertoService.delete(aeropuertoId);
    }
}
