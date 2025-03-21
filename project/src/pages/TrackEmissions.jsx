import { useState } from 'react';

export default function TrackEmissions() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fuelType: '',
    mileage: '',
    distance: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-8">
        Let's track our vehicular emission
      </h1>

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-24 h-1 ${
                  step > num ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-[#E8FFE8]"
              value={formData.fuelType}
              onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance Covered
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-[#E8FFE8]"
              value={formData.distance}
              onChange={(e) => setFormData({...formData, distance: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage(KM/L)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-[#E8FFE8]"
              value={formData.mileage}
              onChange={(e) => setFormData({...formData, mileage: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}