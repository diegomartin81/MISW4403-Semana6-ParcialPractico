import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasLista: AerolineaEntity[];

  /*function formattedDate(date: Date): Date {
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return new Date(`${anio}-${mes}-${dia}`);
  }*/

  const seedDatabase = async () => {
    repository.clear();
    aerolineasLista = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.airline.airline().name,
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.internet.domainName()})
        aerolineasLista.push(aerolinea);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las aerolineas', async () => {
    const aerolinea: AerolineaEntity[] = await service.findAll();
    expect(aerolinea).not.toBeNull();
    expect(aerolinea).toHaveLength(aerolineasLista.length);
  });

  it('findOne debe retornar una aerolinea por id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasLista[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(storedAerolinea.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb)
  });

  it('findOne debe lanzar una excepcion por una aerolinea invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada")
  });

  it('create debe retornar una nueva aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.airline.airline().name,
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.domainName(),
      aeropuertos: []
    }

    console.log("Aerolinea", aerolinea);

    const nuevaAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(aerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: nuevaAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(nuevaAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(nuevaAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(nuevaAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(nuevaAerolinea.paginaWeb)
  });

  it('update debe modificar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasLista[0];
    aerolinea.nombre = "Nuevo Nombre";
    aerolinea.descripcion = "Nueva Descripcion";
     const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
     const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });

  it('update debe lanzar una excepcion por una aerolinea invalida', async () => {
    let aerolinea: AerolineaEntity = aerolineasLista[0];
    aerolinea = {
      ...aerolinea, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada")
  });

  it('delete debe eliminar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasLista[0];
    await service.delete(aerolinea.id);
     const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });

  it('delete debe lanzar una excepcion por una aerolinea invalida', async () => {
    const aerolinea: AerolineaEntity = aerolineasLista[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada")
  });

});
