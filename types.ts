export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Bike' | 'Scooter' | 'EV Car' | 'EV Bike';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
export type DrivingStyle = 'Eco' | 'Normal' | 'Aggressive';
export type RoadCondition = 'City' | 'Highway' | 'Mixed';

export interface TripInput {
  inputType: 'distance' | 'route';
  distance?: number;
  origin?: string;
  destination?: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  drivingStyle: DrivingStyle;
  roadCondition: RoadCondition;
  isAcOn: boolean;
}

export interface ComparisonItem {
  vehicleType: string;
  fuelType: string;
  estimatedConsumption: string; // e.g. "5.2 L" or "12 kWh"
  estimatedCost: number; // in INR
  co2Emissions: number; // in kg
  efficiency: string; // e.g. "15 km/L"
}

export interface EstimationResult {
  tripDistanceKm: number;
  primaryEstimate: ComparisonItem;
  comparison: ComparisonItem[];
  assumptions: {
    fuelPrice: number;
    fuelUnit: string;
    mileageAssumption: string;
    description: string;
  };
  tips: string[];
}