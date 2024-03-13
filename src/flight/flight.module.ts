import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';

@Module({
  imports: [HttpModule],
  providers: [FlightService],
  controllers: [FlightController],
})
export class FlightModule {}
