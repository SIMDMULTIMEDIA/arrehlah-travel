export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  returnDate?: string;
  duration: string;
  stops: number;
  cabinClass: string;
  baggageAllowance: string;
  price: number;
  currency: string;
  status: "AVAILABLE" | "SOLD_OUT";
}

export interface FlightSearchCriteria {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  cabinClass?: string;
  tripType?: "ROUND_TRIP" | "ONE_WAY";
}

export interface FlightProvider {
  searchFlights(criteria: FlightSearchCriteria): Promise<FlightOffer[]>;
  getFlightOffer(offerId: string): Promise<FlightOffer | null>;
}

// Development Mock Data
const MOCK_FLIGHTS: FlightOffer[] = [
  // Domestic
  {
    id: "MOCK-MAX-KAN-ABV-001",
    airline: "Max Air",
    airlineCode: "VM",
    flightNumber: "VM1610",
    origin: "KAN",
    destination: "ABV",
    departureTime: "08:30",
    arrivalTime: "09:30",
    departureDate: "2026-10-01",
    duration: "1h 00m",
    stops: 0,
    cabinClass: "Economy",
    baggageAllowance: "20kg",
    price: 85000,
    currency: "NGN",
    status: "AVAILABLE",
  },
  {
    id: "MOCK-APK-ABV-LOS-001",
    airline: "Air Peace",
    airlineCode: "P4",
    flightNumber: "P47120",
    origin: "ABV",
    destination: "LOS",
    departureTime: "12:00",
    arrivalTime: "13:15",
    departureDate: "2026-10-01",
    duration: "1h 15m",
    stops: 0,
    cabinClass: "Economy",
    baggageAllowance: "20kg",
    price: 95000,
    currency: "NGN",
    status: "AVAILABLE",
  },
  // International
  {
    id: "MOCK-QA-KAN-DXB-001",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR1424",
    origin: "KAN",
    destination: "DXB",
    departureTime: "14:30",
    arrivalTime: "06:15",
    departureDate: "2026-10-15",
    duration: "13h 45m",
    stops: 1,
    cabinClass: "Economy",
    baggageAllowance: "30kg",
    price: 850000,
    currency: "NGN",
    status: "AVAILABLE",
  },
  {
    id: "MOCK-EK-LOS-DXB-001",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK784",
    origin: "LOS",
    destination: "DXB",
    departureTime: "18:10",
    arrivalTime: "05:00",
    departureDate: "2026-10-20",
    duration: "7h 50m",
    stops: 0,
    cabinClass: "Business",
    baggageAllowance: "40kg",
    price: 2500000,
    currency: "NGN",
    status: "AVAILABLE",
  },
  {
    id: "MOCK-BA-LOS-LHR-001",
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA074",
    origin: "LOS",
    destination: "LHR",
    departureTime: "22:45",
    arrivalTime: "05:25",
    departureDate: "2026-11-05",
    duration: "6h 40m",
    stops: 0,
    cabinClass: "Economy",
    baggageAllowance: "23kg",
    price: 1100000,
    currency: "NGN",
    status: "AVAILABLE",
  },
  {
    id: "MOCK-TK-KAN-JED-001",
    airline: "Turkish Airlines",
    airlineCode: "TK",
    flightNumber: "TK0588",
    origin: "KAN",
    destination: "JED",
    departureTime: "23:05",
    arrivalTime: "08:15",
    departureDate: "2026-12-01",
    duration: "7h 10m",
    stops: 1,
    cabinClass: "Economy",
    baggageAllowance: "30kg",
    price: 980000,
    currency: "NGN",
    status: "AVAILABLE",
  }
];

export class MockFlightProvider implements FlightProvider {
  async searchFlights(criteria: FlightSearchCriteria): Promise<FlightOffer[]> {
    // In a real provider, we'd pass these criteria to the API.
    // For the mock, we filter the static catalog.
    let results = [...MOCK_FLIGHTS];

    if (criteria.origin) {
      results = results.filter(f => f.origin.toLowerCase() === criteria.origin?.toLowerCase());
    }
    if (criteria.destination) {
      results = results.filter(f => f.destination.toLowerCase() === criteria.destination?.toLowerCase());
    }

    return results;
  }

  async getFlightOffer(offerId: string): Promise<FlightOffer | null> {
    const offer = MOCK_FLIGHTS.find((f) => f.id === offerId);
    return offer || null;
  }
}

// Global instance to use throughout the app
export const flightProvider = new MockFlightProvider();
