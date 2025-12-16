import React, { useState } from 'react';
import { TripInput, VehicleType, FuelType, DrivingStyle, RoadCondition } from '../types';
import { Navigation, Route, Zap, Droplet, Wind, Gauge, Snowflake, MapPin, Calculator } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripInput) => void;
  isLoading: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [inputType, setInputType] = useState<'distance' | 'route'>('route');
  const [distance, setDistance] = useState<number | ''>('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const [vehicleType, setVehicleType] = useState<VehicleType>('Hatchback');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [drivingStyle, setDrivingStyle] = useState<DrivingStyle>('Normal');
  const [roadCondition, setRoadCondition] = useState<RoadCondition>('Mixed');
  const [isAcOn, setIsAcOn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: TripInput = {
      inputType,
      vehicleType,
      fuelType,
      drivingStyle,
      roadCondition,
      isAcOn,
      ...(inputType === 'distance' ? { distance: Number(distance) } : { origin, destination }),
    };

    if (inputType === 'distance' && (!distance || Number(distance) <= 0)) {
      alert("Please enter a valid distance.");
      return;
    }
    if (inputType === 'route' && (!origin || !destination)) {
      alert("Please enter both origin and destination.");
      return;
    }

    onSubmit(payload);
  };

  const updateFuelBasedOnVehicle = (v: VehicleType) => {
    setVehicleType(v);
    if (v.includes('EV')) {
      setFuelType('Electric');
    } else if (v === 'Bike' || v === 'Scooter') {
      setFuelType('Petrol');
    } else {
      setFuelType('Petrol'); // Default reset for cars
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Input Type Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setInputType('route')}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            inputType === 'route' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Route className="w-4 h-4 mr-2" />
          By Route
        </button>
        <button
          type="button"
          onClick={() => setInputType('distance')}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            inputType === 'distance' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4 mr-2" />
          By Distance
        </button>
      </div>

      {/* Dynamic Inputs */}
      {inputType === 'route' ? (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">To</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Pune"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-top-2 duration-300">
           <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Distance (km)</label>
            <div className="relative">
              <Route className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="1"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g., 150"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
        </div>
      )}

      {/* Vehicle Specs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Vehicle</label>
          <select
            value={vehicleType}
            onChange={(e) => updateFuelBasedOnVehicle(e.target.value as VehicleType)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury Car</option>
            <option value="Bike">Bike (Motorcycle)</option>
            <option value="Scooter">Scooter</option>
            <option value="EV Car">Electric Car</option>
            <option value="EV Bike">Electric Bike</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fuel</label>
          <div className="relative">
             <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              disabled={vehicleType.includes('EV')}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
            {vehicleType.includes('EV') && <Zap className="absolute right-8 top-3 w-4 h-4 text-yellow-500" />}
          </div>
        </div>
      </div>

      {/* Driving Conditions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Style</label>
          <select
            value={drivingStyle}
            onChange={(e) => setDrivingStyle(e.target.value as DrivingStyle)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Eco">Eco (Relaxed)</option>
            <option value="Normal">Normal</option>
            <option value="Aggressive">Aggressive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Roads</label>
          <select
            value={roadCondition}
            onChange={(e) => setRoadCondition(e.target.value as RoadCondition)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="City">City Traffic</option>
            <option value="Highway">Highway</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Snowflake className="w-5 h-5" />
        </div>
        <div className="flex-grow">
          <span className="text-sm font-medium text-slate-700">Air Conditioning</span>
          <p className="text-xs text-slate-500">Uses ~10-15% more fuel</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isAcOn} 
            onChange={(e) => setIsAcOn(e.target.checked)} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <Calculator className="w-5 h-5" />
            <span>Estimate Cost</span>
          </>
        )}
      </button>

    </form>
  );
};
