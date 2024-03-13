import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

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
export class FlightService {
  private readonly dataSourceUrls = [
    'https://coding-challenge.powerus.de/flight/source1',
    'https://coding-challenge.powerus.de/flight/source2',
  ];

  constructor(private httpService: HttpService) {}

  async fetchFlightsFromExternalSources(): Promise<FlightHttpResult> {
    const flightDataPromises = this.dataSourceUrls.map((url) =>
      firstValueFrom(this.httpService.get(url)),
    );

    const results = (await Promise.allSettled(flightDataPromises))
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result: PromiseFulfilledResult<AxiosResponse<FlightHttpResult>>) =>
          result.value.data.flights,
      );

    console.log('original length', results.flat().length);
    console.log(
      'removed duplicates length',
      this.removeDuplicates({ flights: results.flat() }).flights.length,
    );

    return this.removeDuplicates({ flights: results.flat() });
  }

  private removeDuplicates(data: FlightHttpResult): FlightHttpResult {
    // use flight number and dates as identifiers
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

  async populateFlightsCache() {}
}
