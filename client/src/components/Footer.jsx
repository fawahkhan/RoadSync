import { Navigation2, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Navigation2 className="text-teal-400" size={24} />
              <span className="text-lg font-bold text-white">RoadSync</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making cities smarter, safer, and more sustainable through innovative mobility solutions.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/smart-parking" className="text-gray-400 hover:text-white transition-colors">Smart Parking</Link></li>
              <li><Link to="/track-emissions" className="text-gray-400 hover:text-white transition-colors">Emissions Tracker</Link></li>
              <li><Link to="/report-crime" className="text-gray-400 hover:text-white transition-colors">Report Incident</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@roadsync.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Smart City Ave,<br/>Innovation District, 12345</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RoadSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}