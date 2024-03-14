import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  flightsResponse1,
  flightsResponse2,
  flightsWithoutDuplicates,
} from './mocks/flights';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/redis/redis.service';
import RedisMock from 'ioredis-mock';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;
  let redisService: RedisService;

  // mock calls to external urls
  const externalServerMock = setupServer(
    http.get('https://coding-challenge.powerus.de/flight/source1', () => {
      return HttpResponse.json(flightsResponse1);
    }),
    http.get('https://coding-challenge.powerus.de/flight/source2', () => {
      return HttpResponse.json(flightsResponse2);
    }),
  );

  beforeAll(() => {
    // https://stackoverflow.com/questions/68024935/msw-logging-warnings-for-unhandled-supertest-requests
    externalServerMock.listen({ onUnhandledRequest: 'bypass' });
  });

  beforeEach(async () => {
    const redisMock = new RedisMock();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // override RedisService to use a mock
      .overrideProvider(RedisService)
      .useValue({
        getClient: () => redisMock,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    redisService = moduleFixture.get<RedisService>(RedisService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await redisService.getClient().flushall();
    externalServerMock.resetHandlers();
  });

  afterAll(() => {
    externalServerMock.close();
  });

  it('/flights (GET) - returns the flights data without duplicates', () => {
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .expect(flightsWithoutDuplicates);
  });
});
