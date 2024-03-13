import { Module } from '@nestjs/common';
import { FlightModule } from './flight/flight.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [FlightModule],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
