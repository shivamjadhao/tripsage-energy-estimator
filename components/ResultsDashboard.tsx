import React from 'react';
import { EstimationResult, TripInput } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IndianRupee, Leaf, Fuel, Info, TrendingUp, CheckCircle2, Map } from 'lucide-react';

interface ResultsDashboardProps {
  result: EstimationResult;
  input: TripInput;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, input }) => {
  const { primaryEstimate, comparison, tripDistanceKm, assumptions, tips } = result;

  const chartData = comparison.map(item => ({
    name: `${item.vehicleType} (${item.fuelType})`,
    Cost: item.estimatedCost,
    CO2: item.co2Emissions,
  }));

  const mapUrl = input.inputType === 'route' && input.origin && input.destination
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(input.origin)}&destination=${encodeURIComponent(input.destination)}`
    : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-semibold uppercase">Total Cost</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{primaryEstimate.estimatedCost.toFixed(0)}</p>
          <p className="text-xs text-slate-400 mt-1">Based on {assumptions.fuelPrice} {assumptions.fuelUnit}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-semibold uppercase">CO₂ Emissions</h3>
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{primaryEstimate.co2Emissions.toFixed(1)} <span className="text-lg font-normal text-slate-500">kg</span></p>
          <p className="text-xs text-slate-400 mt-1">For {tripDistanceKm} km trip</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-semibold uppercase">Fuel Used</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Fuel className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{primaryEstimate.estimatedConsumption}</p>
          <p className="text-xs text-slate-400 mt-1">Efficiency: {primaryEstimate.efficiency}</p>
        </div>
      </div>

      {/* Map Integration Card (Conditional) */}
      {mapUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row items-center p-1">
          <div className="p-6 flex-1">
             <div className="flex items-center gap-2 mb-2">
               <Map className="w-5 h-5 text-blue-500" />
               <h3 className="font-bold text-slate-800">Visualise Route</h3>
             </div>
             <p className="text-slate-600 text-sm mb-4">
               View the detailed path from <strong>{input.origin}</strong> to <strong>{input.destination}</strong> on Google Maps. 
               Check live traffic and alternate routes.
             </p>
             <a 
               href={mapUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
             >
               Open in Google Maps
               <TrendingUp className="w-4 h-4" />
             </a>
          </div>
          <div className="w-full md:w-1/3 h-32 md:h-full bg-slate-50 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100">
             <Map className="w-12 h-12 text-slate-300" />
          </div>
        </div>
      )}

      {/* Comparison Chart & Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Cost & CO₂ Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis yAxisId="left" orientation="left" stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}kg`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="Cost" fill="#059669" name="Cost (₹)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="CO2" fill="#94a3b8" name="CO₂ (kg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-50">
             <h3 className="text-lg font-bold text-slate-800">Vehicle Comparison</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                 <tr>
                   <th className="px-6 py-3">Vehicle</th>
                   <th className="px-6 py-3">Cost</th>
                   <th className="px-6 py-3">CO₂</th>
                   <th className="px-6 py-3">Efficiency</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {comparison.map((item, idx) => (
                   <tr key={idx} className={item.vehicleType === primaryEstimate.vehicleType && item.fuelType === primaryEstimate.fuelType ? 'bg-emerald-50/50' : ''}>
                     <td className="px-6 py-4 font-medium text-slate-800">
                        {item.vehicleType}
                        <span className="block text-xs font-normal text-slate-500">{item.fuelType}</span>
                     </td>
                     <td className="px-6 py-4 text-emerald-700 font-bold">₹{item.estimatedCost}</td>
                     <td className="px-6 py-4 text-slate-600">{item.co2Emissions} kg</td>
                     <td className="px-6 py-4 text-slate-500">{item.efficiency}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Bottom: Tips & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
           <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5" />
             Smart Saving Tips
           </h3>
           <ul className="space-y-3">
             {tips.map((tip, idx) => (
               <li key={idx} className="flex items-start gap-3 text-indigo-800 text-sm">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                 {tip}
               </li>
             ))}
           </ul>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Assumptions & Methodology
          </h3>
          <div className="text-sm text-slate-600 space-y-2">
            <p><span className="font-semibold">Distance:</span> {tripDistanceKm} km</p>
            <p><span className="font-semibold">Fuel Price:</span> ₹{assumptions.fuelPrice} / {assumptions.fuelUnit}</p>
            <p><span className="font-semibold">Mileage Logic:</span> {assumptions.mileageAssumption}</p>
            <p className="italic border-t border-slate-200 pt-2 mt-2">{assumptions.description}</p>
          </div>
        </div>
      </div>

    </div>
  );
};