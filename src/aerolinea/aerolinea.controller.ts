import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService){}

    @Get()
    async findAll() {
      return await this.aerolineaService.findAll();
    }
  
    @Get(':airlineId')
    async findOne(@Param('airlineId') aerolineaId: string) {
      return await this.aerolineaService.findOne(aerolineaId);
    }
  
    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.create(aerolinea);
    }
  
    @Put(':airlineId')
    async update(@Param('airlineId') aerolineaId: string, @Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.update(aerolineaId, aerolinea);
    }
  
    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('airlineId') aerolineaId: string) {
      return await this.aerolineaService.delete(aerolineaId);
    }
}
