import { Module } from '@nestjs/common';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [FlightModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
