import { useState } from 'react';
import { api } from '../lib/supabase';

export default function TrackEmissions() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1
    companyName: '',
    carModel: '',
    engineSize: '',
    cylinders: '',
    // Step 2
    fuelType: '',
    mileage: '',
    distance: '',
  });

  const carCompanies = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla'];
  const engineSizes = ['1.0L', '1.5L', '2.0L', '2.5L', '3.0L', '4.0L'];
  const cylinderOptions = ['3', '4', '6', '8', '12'];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.saveEmissionData(
        formData.fuelType,
        parseFloat(formData.distance),
        parseFloat(formData.mileage)
      );
      // Mock result for demonstration
      setResult({
        co2Emitted: 987,
        gemsEarned: 45,
        percentile: 85,
      });
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    setStep(step + 1);
  }

  function handleStartNew() {
    setStep(1);
    setResult(null);
    setFormData({
      companyName: '',
      carModel: '',
      engineSize: '',
      cylinders: '',
      fuelType: '',
      mileage: '',
      distance: '',
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Let's track our vehicular emission
      </h1>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  step > num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  required
                >
                  <option value="">Select company</option>
                  {carCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Model
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                  placeholder="Enter car model"
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Size (L)
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                  value={formData.engineSize}
                  onChange={(e) => setFormData({...formData, engineSize: e.target.value})}
                  required
                >
                  <option value="">Select engine size</option>
                  {engineSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cylinders
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                  value={formData.cylinders}
                  onChange={(e) => setFormData({...formData, cylinders: e.target.value})}
                  required
                >
                  <option value="">Select cylinders</option>
                  {cylinderOptions.map(cyl => (
                    <option key={cyl} value={cyl}>{cyl}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                required
              >
                <option value="">Select fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance Covered (km)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                placeholder="Enter distance"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: e.target.value})}
                required
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage (KM/L)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md bg-[#E8FFE8]"
                placeholder="Enter mileage"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                required
                min="0"
                step="0.1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        )}

        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Total CO2 Emitted: {result.co2Emitted}gms
              </h2>

              <div className="space-y-2 text-left mb-6">
                <h3 className="font-medium">Suggestions:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Prioritize fuel-efficient vehicles</li>
                  <li>Drive less and more efficiently</li>
                  <li>Alternative transportation options like cycling or public transit</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="mb-2">
                  🔥 Your Carbon Footprint is less than {result.percentile}% of users
                </p>
                <p className="text-green-600">Gems Earned: {result.gemsEarned}</p>
              </div>

              <p className="text-gray-600 mb-2">
                🎯 Let's set a target to less than 10% for next analysis.
              </p>
              <p className="text-gray-600">
                All the best! Keep pushing your limits 💪
              </p>
            </div>

            <button
              onClick={handleStartNew}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}