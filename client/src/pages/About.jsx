import { Navigation2, Shield, Leaf, MapPin, Award, Users } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Shield, title: 'Safe & Secure', description: 'Advanced security measures to protect your data and privacy', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Leaf, title: 'Eco-Friendly', description: 'Helping reduce carbon emissions through smart transportation', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: MapPin, title: 'Smart Navigation', description: 'Find parking and optimize routes with real-time data', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Award, title: 'Rewards System', description: 'Earn gems and badges for contributing to a better city', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: Users, title: 'Community Driven', description: 'Join citizens working together for safer, cleaner cities', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Navigation2 className="text-teal-600" size={36} />
          <span className="text-2xl font-bold text-gray-900">RoadSync</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Making Cities Smarter, Safer, and Sustainable</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          RoadSync is your all-in-one platform for smart city navigation, parking management, and community safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {features.map((f, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className={`inline-flex p-2.5 rounded-lg ${f.bg} mb-4`}>
              <f.icon size={20} className={f.color} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-8 mb-16">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-3">Our Mission</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto leading-relaxed">
          To transform urban mobility through innovative technology, making cities more livable, sustainable, and connected.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
        <p className="text-sm text-gray-500 mb-5">Have questions? We'd love to hear from you.</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>📧 contact@roadsync.com</p>
          <p>📞 (555) 123-4567</p>
          <p>📍 123 Innovation Street, Smart City</p>
        </div>
      </div>
    </div>
  );
}