import { useState } from 'react';
import { emissionsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function TrackEmissions() {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '', carModel: '', engineSize: '', cylinders: '', fuelType: '', mileage: '', distance: '',
  });

  const carCompanies = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Kia'];
  const engineSizes = ['1.0L', '1.2L', '1.5L', '2.0L', '2.5L', '3.0L', '4.0L'];
  const cylinderOptions = ['3', '4', '6', '8', '12'];

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        vehicle: { company: formData.companyName, model: formData.carModel, fuelType: formData.fuelType, engineCC: parseFloat(formData.engineSize) * 1000 || 0, cylinders: parseInt(formData.cylinders) || 0, mileage: parseFloat(formData.mileage) },
        trip: { distanceKm: parseFloat(formData.distance) },
      };
      const res = await emissionsAPI.calculate(payload);
      setResult({ co2Emitted: res.data.co2Grams, gemsEarned: res.data.gemsEarned, percentile: res.data.percentile, fuelConsumed: res.data.fuelConsumedLitres, aiAnalysis: res.data.record?.aiAnalysis });
      setStep(3);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate emissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleStartNew() {
    setStep(1); setResult(null); setError(null);
    setFormData({ companyName: '', carModel: '', engineSize: '', cylinders: '', fuelType: '', mileage: '', distance: '' });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track CO₂ Emissions</h1>
      <p className="text-gray-500 mb-8">Log a trip to calculate your carbon footprint and earn rewards.</p>

      {/* Progress */}
      <div className="flex items-center mb-8 max-w-lg">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= num ? 'bg-teal-600 text-white' : 'bg-gray-100 border border-gray-200 text-gray-400'
            }`}>
              {step > num ? <CheckCircle size={16} /> : num}
            </div>
            {num < 3 && <div className={`h-0.5 flex-1 mx-2 rounded-full transition-colors ${step > num ? 'bg-teal-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm max-w-lg">{error}</div>
      )}

      <div className="max-w-lg bg-white border border-gray-200 rounded-xl p-6">
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Step 1 — Vehicle details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Company</label>
                <select className={inputCls} value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required>
                  <option value="">Select</option>
                  {carCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Model</label>
                <input type="text" className={inputCls} placeholder="e.g. Civic" value={formData.carModel} onChange={(e) => setFormData({...formData, carModel: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Engine Size</label>
                <select className={inputCls} value={formData.engineSize} onChange={(e) => setFormData({...formData, engineSize: e.target.value})} required>
                  <option value="">Select</option>
                  {engineSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Cylinders</label>
                <select className={inputCls} value={formData.cylinders} onChange={(e) => setFormData({...formData, cylinders: e.target.value})} required>
                  <option value="">Select</option>
                  {cylinderOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm mt-2">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Step 2 — Trip details</p>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Fuel Type</label>
              <select className={inputCls} value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} required>
                <option value="">Select</option>
                <option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="cng">CNG</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Distance (km)</label>
              <input type="number" className={inputCls} placeholder="e.g. 25" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} required min="0.1" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Mileage (km/L)</label>
              <input type="number" className={inputCls} placeholder="e.g. 15" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required min="0.1" step="0.1" />
            </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm disabled:opacity-50 mt-2">
              {loading ? 'Calculating...' : 'Calculate Emissions'}
            </button>
          </form>
        )}

        {step === 3 && result && (
          <div className="space-y-5">
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 mb-1">Total CO₂ Emitted</p>
              <p className="text-3xl font-bold text-gray-900">{(result.co2Emitted / 1000).toFixed(2)} <span className="text-lg font-normal text-gray-500">kg</span></p>
              <p className="text-xs text-gray-400 mt-1">{result.co2Emitted}g · Fuel: {result.fuelConsumed}L</p>
            </div>
            {result.aiAnalysis && (
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700 text-sm mb-1">🤖 AI Analysis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{result.aiAnalysis}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Better than</p>
                <p className="text-lg font-bold text-teal-600">{result.percentile}%</p>
                <p className="text-xs text-gray-400">of users</p>
              </div>
              <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Earned</p>
                <p className="text-lg font-bold text-teal-600">💎 +{result.gemsEarned}</p>
                <p className="text-xs text-gray-400">gems</p>
              </div>
            </div>
            <button onClick={handleStartNew} className="w-full bg-gray-50 text-gray-900 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors font-semibold text-sm">
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}