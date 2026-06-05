import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { crimesAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function ReportCrime() {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    reportType: 'emergency',
    location: '',
    date: '',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('type', formData.reportType);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('incidentDate', formData.date || new Date().toISOString());
      data.append('incidentTime', formData.time);

      // Append files
      files.forEach(file => {
        data.append('attachments', file);
      });

      await crimesAPI.report(data);
      setSuccess(true);
      await refreshUser();

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          time: '',
          reportType: 'emergency',
          location: '',
          date: '',
          description: '',
        });
        setFiles([]);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-2">Your report has been received and is under review.</p>
          <p className="text-green-500 font-semibold">💎 +15 Gems Earned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Report Emergencies/Crime
      </h1>
      <p className="text-gray-600 mb-8">
        Report about any kind of emergencies or crime you have come across.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              className="w-full p-2 border rounded-md bg-[#E8FFE8]"
              value={formData.reportType}
              onChange={(e) => setFormData({...formData, reportType: e.target.value})}
              required
            >
              <option value="emergency">Emergency Situation</option>
              <option value="accident">Accident</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="traffic_violation">Traffic Violation</option>
              <option value="other">Other</option>
            </select>
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
              Location
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-32"
            placeholder="Describe the emergency or crime in detail..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            maxLength={2000}
          />
          <p className="text-xs text-gray-400 mt-1">{formData.description.length}/2000</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachments (optional)
          </label>
          <div className="border-2 border-dashed rounded-md p-8 text-center">
            <Upload className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">Upload photos or documents</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setFiles([...e.target.files])}
              className="text-sm"
            />
            {files.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}