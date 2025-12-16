import React, { useState } from 'react';
import { TripForm } from './components/TripForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { estimateTrip } from './services/geminiService';
import { TripInput, EstimationResult } from './types';
import { Car, MapPin, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [currentInput, setCurrentInput] = useState<TripInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async (input: TripInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentInput(input);
    try {
      const data = await estimateTrip(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate estimation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">TripSage</h1>
          </div>
          <div className="hidden md:block text-sm opacity-90">
            Smart Travel Cost & Carbon Estimator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-800">Trip Details</h2>
              </div>
              <div className="p-6">
                <TripForm onSubmit={handleEstimate} isLoading={loading} />
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-sm text-emerald-800">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Did you know?
              </h3>
              <p>
                Aggressive driving in city traffic can increase fuel consumption by up to 40%. 
                Switching to Eco mode and smooth braking saves money instantly.
              </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 xl:col-span-9">
            {loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 text-slate-500 animate-in fade-in duration-500">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                <p className="text-lg font-medium">Analyzing trip details...</p>
                <p className="text-sm">Calculating route efficiency, fuel costs, and environmental impact.</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Car className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">Enter your trip details to get an estimate.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Estimation Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loading && result && currentInput && (
              <ResultsDashboard result={result} input={currentInput} />
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TripSage. Powered by AI.</p>
          <p className="mt-2 text-xs opacity-60">Estimates are based on general vehicle data and average market rates. Actual mileage may vary.</p>
        </div>
      </footer>
    </div>
  );
}