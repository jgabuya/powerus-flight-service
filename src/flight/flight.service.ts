import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../redis/redis.service';

type FlightSlice = {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: Date;
  flight_number: Date;
  duration: number;
};

type Flight = {
  slices: [FlightSlice, FlightSlice];
  price: number;
};

type FlightHttpResult = {
  flights: Flight[];
};

@Injectable()
export class FlightService implements OnModuleInit {
  private readonly ttlInSeconds = 3600;

  private readonly dataSourceUrls = [
    'https://coding-challenge.powerus.de/flight/source1',
    'https://coding-challenge.powerus.de/flight/source2',
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.loadFlights();
  }

  private async fetchFlights(): Promise<FlightHttpResult> {
    const flightDataPromises = this.dataSourceUrls.map((url) =>
      firstValueFrom(this.httpService.get(url)),
    );

    const results = (await Promise.allSettled(flightDataPromises))
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result: PromiseFulfilledResult<AxiosResponse<FlightHttpResult>>) =>
          result.value.data.flights,
      );

    return { flights: results.flat() };
  }

  private removeDuplicates(data: FlightHttpResult): FlightHttpResult {
    // use flight number and dates as unique flight identifiers
    const seen = new Set();

    const uniqueFlights = data.flights.filter((flight) => {
      const key = flight.slices
        .map(
          (slice) =>
            slice.flight_number + slice.departure_date_time_utc.toString(),
        )
        .join('');

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    return { flights: uniqueFlights };
  }

  @Cron('0 * * * *') // run every hour
  private async loadFlights() {
    const flightsData = await this.fetchFlights();
    const uniqueFlights = this.removeDuplicates(flightsData);

    await this.redisService
      .getClient()
      .set('flights', JSON.stringify(uniqueFlights), 'EX', this.ttlInSeconds);
  }

  async getFlights() {
    const flights = await this.redisService.getClient().get('flights');

    if (!flights) {
      return [];
    }

    return JSON.parse(flights);
  }
}
