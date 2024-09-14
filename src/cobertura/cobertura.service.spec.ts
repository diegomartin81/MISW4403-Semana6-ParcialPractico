import { Test, TestingModule } from '@nestjs/testing';
import { CoberturaService } from './cobertura.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CoberturaService', () => {
  let service: CoberturaService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosLista: AeropuertoEntity[];

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
 
    aeropuertosLista = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.airline.airport().name,
          codigo: faker.airline.airport().iataCode,
          pais: faker.location.country(),
          ciudad: faker.location.city()
        })
        aeropuertosLista.push(aeropuerto);
    }
 
    aerolinea = await aerolineaRepository.save({
      nombre: faker.airline.airline().name,
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.domainName(),
      aeropuertos: aeropuertosLista
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CoberturaService],
    }).compile();

    service = module.get<CoberturaService>(CoberturaService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline debe asociar un aeropuerto a una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.airline.airline().name,
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.domainName(),
    })
    
    const result: AerolineaEntity = await service.addAirportToAirline(newAerolinea.id, newAeropuerto.id);

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);

  });

  it('addAirportToAirline debe lanzar una excepcion por un aeropuerto invalido', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.airline.airline().name,
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.domainName() 
    })
 
    await expect(() => service.addAirportToAirline(newAerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });

  it('addAirportToAirline debe lanzar una excepcion por una aerolinea invalida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(() => service.addAirportToAirline("0", newAeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada");
  });

  it('findAirportFromAirline debe retornar un aeropuerto que que contenga una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAirportFromAirline debe lanzar una excepcion por un aeropuerto invalido', async () => {
    await expect(()=> service.findAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });

  it('findAirportFromAirline debe lanzar una excepcion por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    await expect(()=> service.findAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada");
  });

  it('findAirportFromAirline debe lanzar una excepcion por un aeropuerto que no contiene una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.findAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no contiene la aerolinea");
  });

  it('findAirportsFromAirline debe retornar los aeropuertos que contienen una aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAirportsFromAirline debe lanzar una excepcion por una aerolinea invalida', async () => {
    await expect(()=> service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada");
  });

  it('updateAirportsFromAirline debe actualizar la lista de aeropuertos que cubre una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    const updatedAerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
 
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('updateAirportsFromAirline debe lanzar una excepcion por una aerolinea invalida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.updateAirportsFromAirline("0", [newAeropuerto])).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada");
  });

  it('updateAirportsFromAirline debe lanzar una excepcion por un aeropuerto invalido', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosLista[0];
    newAeropuerto.id = "0";
 
    await expect(()=> service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });

  it('deleteAirportFromAirline debe eliminar un aeropuerto que cubre de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
   
    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);
 
    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);
 
    expect(deletedAeropuerto).toBeUndefined();
 
  });

  it('deleteAirportFromAirline debe lanzar una excepcion por un aeropuerto invalido', async () => {
    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });

  it('deleteAirportFromAirline debe lanzar una excepcion por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    await expect(()=> service.deleteAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el id dado no fue encontrada");
  });

  it('deleteAirportFromAirline debe lanzar una excepcion por un aeropuerto no asociado', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no contiene la aerolinea");
  });

});
