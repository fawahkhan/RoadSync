import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { crimesAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function ReportCrime() {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', time: '', reportType: 'emergency', location: '', date: '', description: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const data = new FormData();
      data.append('type', formData.reportType);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('incidentDate', formData.date || new Date().toISOString());
      data.append('incidentTime', formData.time);
      files.forEach(file => data.append('attachments', file));
      await crimesAPI.report(data);
      setSuccess(true);
      await refreshUser();
      setTimeout(() => { setSuccess(false); setFormData({ name: '', time: '', reportType: 'emergency', location: '', date: '', description: '' }); setFiles([]); }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="text-teal-600 mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
          <p className="text-gray-500 mb-3">Your report is under review. Thank you for keeping the community safe.</p>
          <span className="inline-flex items-center px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-medium">💎 +15 Gems Earned</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Incident</h1>
      <p className="text-gray-500 mb-8">Help your community by reporting emergencies, accidents, or safety concerns.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm max-w-2xl">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Report Type</label>
            <select className={inputCls} value={formData.reportType} onChange={(e) => setFormData({...formData, reportType: e.target.value})} required>
              <option value="emergency">Emergency</option><option value="accident">Accident</option><option value="theft">Theft</option><option value="assault">Assault</option><option value="traffic_violation">Traffic Violation</option><option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Time</label>
            <input type="time" className={inputCls} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Location</label>
            <input type="text" className={inputCls} placeholder="Where did it happen?" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Date</label>
            <input type="date" className={inputCls} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
          <textarea className={`${inputCls} h-28 resize-none`} placeholder="Describe what happened..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required maxLength={2000} />
          <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length}/2000</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Attachments (optional)</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer relative">
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-500">Click to upload photos or documents</p>
            <input type="file" multiple accept="image/*,.pdf" onChange={(e) => setFiles([...e.target.files])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {files.length > 0 && <p className="text-xs text-teal-600 mt-2 font-medium">{files.length} file(s) selected</p>}
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}