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
import * as nock from 'nock';
import RedisMock from 'ioredis-mock';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;
  let redisService: RedisService;

  beforeEach(async () => {
    const redisMock = new RedisMock();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue({
        getClient: () => redisMock,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    redisService = moduleFixture.get<RedisService>(RedisService);
    await app.init();

    nock('https://coding-challenge.powerus.de')
      .get('/flight/source1')
      .reply(200, flightsResponse1)
      .get('/flight/source2')
      .reply(200, flightsResponse2);
  });

  afterEach(async () => {
    await app.close();
    await redisService.getClient().flushall();
    nock.cleanAll();
  });

  it('/flights (GET)', () => {
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .expect(flightsWithoutDuplicates);
  });
});
