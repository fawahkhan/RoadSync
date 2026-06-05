import { Navigation2, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Navigation2 className="text-blue-400" size={32} />
              <span className="text-xl font-bold text-blue-400">RoadSync</span>
            </div>
            <p className="text-gray-400">
              Making cities smarter, safer, and more sustainable through innovative traffic management solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              <li><Link to="/smart-parking" className="text-gray-400 hover:text-white">Smart Parking</Link></li>
              <li><Link to="/track-emissions" className="text-gray-400 hover:text-white">Track Emissions</Link></li>
              <li><Link to="/report-crime" className="text-gray-400 hover:text-white">Report Crime</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Support Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@roadsync.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Smart City Ave,<br />Innovation District, 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-2 pt-2 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RoadSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}