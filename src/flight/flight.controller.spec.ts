import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { RedisService } from '../redis/redis.service';
import { flightsWithoutDuplicates } from '../../test/mocks/flights';

describe('FlightController', () => {
  let controller: FlightController;
  let flightService: FlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [FlightController],
      providers: [
        {
          provide: FlightService,
          useValue: {
            getFlights: jest.fn().mockResolvedValue(flightsWithoutDuplicates),
          },
        },
        RedisService,
      ],
    }).compile();

    controller = module.get<FlightController>(FlightController);
    flightService = module.get<FlightService>(FlightService);
  });

  it('should return flights data', () => {
    expect(controller.getFlights()).resolves.toEqual(flightsWithoutDuplicates);
    expect(flightService.getFlights).toHaveBeenCalled();
  });
});
