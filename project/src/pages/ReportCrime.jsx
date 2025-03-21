import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function ReportCrime() {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    reportType: 'emergency situation',
    location: '',
    date: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Report Emergencies/Crime
      </h1>
      <p className="text-gray-600 mb-8">
        Report about any kind of emergencies or crime you have came across.
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              className="w-full p-2 border rounded-md"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report about
            </label>
            <select
              className="w-full p-2 border rounded-md bg-[#E8FFE8]"
              value={formData.reportType}
              onChange={(e) => setFormData({...formData, reportType: e.target.value})}
            >
              <option value="emergency situation">Emergency situation</option>
              <option value="crime">Crime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-32"
            placeholder="Describe about your crime or emergencies..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uploads (if any)
          </label>
          <div className="border-2 border-dashed rounded-md p-8 text-center">
            <Upload className="mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload if you have any photos or images</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}