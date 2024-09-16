import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"]});
    }
    
    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"]});
        if(!aerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const fechaCreacion = new Date();
        if(aerolinea.fechaFundacion > fechaCreacion)
          throw new BusinessLogicException("La fecha de fundacion no puede ser posterior a la fecha de creación", BusinessError.PRECONDITION_FAILED);
        return await this.aerolineaRepository.save(aerolinea);
    }
    
    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        const fechaCreacion = new Date();
        if(!persistedAerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        if(aerolinea.fechaFundacion > fechaCreacion)
          throw new BusinessLogicException("La fecha de fundacion no puede ser posterior a la fecha de creación", BusinessError.PRECONDITION_FAILED);
        return await this.aerolineaRepository.save({...persistedAerolinea, ...aerolinea});
    }
    
    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if(!aerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolinea);
    }
}
