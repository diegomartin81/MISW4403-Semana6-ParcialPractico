import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosLista: AeropuertoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosLista = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.airline.airport().name,
        codigo: faker.airline.airport().iataCode,
        pais: faker.location.country(),
        ciudad: faker.location.city()})
        aeropuertosLista.push(aeropuerto);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosLista.length);
  });

  it('findOne debe retornar un aeropuerto por id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertosLista[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
  });

  it('findOne debe lanzar una excepcion por un aeropuerto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado")
  });

  it('create debe retornar un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.airline.airport().name,
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    }

    console.log("Aeropuerto", aeropuerto);

    const nuevoAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(aeropuerto).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: nuevoAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(nuevoAeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(nuevoAeropuerto.codigo)
    expect(storedAeropuerto.pais).toEqual(nuevoAeropuerto.pais)
    expect(storedAeropuerto.ciudad).toEqual(nuevoAeropuerto.ciudad)
  });

  it('update debe modificar un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    aeropuerto.nombre = "Nuevo Nombre";
    aeropuerto.codigo = "XXX";
     const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(aeropuerto.codigo)
  });

  it('update debe lanzar una excepcion por un aeropuerto invalido', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    aeropuerto = {
      ...aeropuerto, nombre: "Nuevo nombre", codigo: "Nuevo codigo"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado")
  });

  it('delete debe eliminar un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    await service.delete(aeropuerto.id);
     const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete debe lanzar una excepcion por un aeropuerto invalido', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosLista[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado")
  });
});
