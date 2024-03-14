import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import RedisMock from 'ioredis-mock';
import { FlightService } from './flight.service';
import { RedisService } from '../redis/redis.service';
import { flightsWithoutDuplicates } from '../../test/mocks/flights';

describe('FlightService', () => {
  let service: FlightService;
  let redisService: RedisService;

  beforeEach(async () => {
    const redisMock = new RedisMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        FlightService,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn().mockReturnValue(redisMock),
          },
        },
      ],
    }).compile();

    service = module.get<FlightService>(FlightService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    // clear Redis after each test
    await redisService.getClient().flushall();
  });

  it('should return flights data from Redis', async () => {
    await redisService
      .getClient()
      .set('flights', JSON.stringify(flightsWithoutDuplicates));

    expect(await service.getFlights()).toEqual(flightsWithoutDuplicates);
  });
});
