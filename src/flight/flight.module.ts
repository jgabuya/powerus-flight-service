import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { RedisService } from '../redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [FlightService, RedisService],
  controllers: [FlightController],
})
export class FlightModule {}
