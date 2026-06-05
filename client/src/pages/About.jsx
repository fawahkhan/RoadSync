import { Navigation2, Shield, Leaf, MapPin, Award, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Shield className="text-blue-500" size={32} />,
      title: 'Safe & Secure',
      description: 'Advanced security measures to protect your data and privacy'
    },
    {
      icon: <Leaf className="text-green-500" size={32} />,
      title: 'Eco-Friendly',
      description: 'Helping reduce carbon emissions through smart transportation'
    },
    {
      icon: <MapPin className="text-red-500" size={32} />,
      title: 'Smart Parking',
      description: 'Find and book parking spots with real-time availability'
    },
    {
      icon: <Award className="text-yellow-500" size={32} />,
      title: 'Rewards',
      description: 'Earn gems and badges for contributing to a better city'
    },
    {
      icon: <Users className="text-purple-500" size={32} />,
      title: 'Community',
      description: 'Join a community of citizens making the city safer'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Navigation2 className="text-blue-600" size={48} />
            <span className="text-3xl font-bold text-blue-600">RoadSync</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Making Cities Smarter, Safer, and More Sustainable
          </h1>
          <p className="text-xl text-gray-600">
            RoadSync is your all-in-one platform for smart city navigation,
            parking management, and community safety.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-blue-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-center mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center">
            To transform urban mobility through innovative technology, making cities
            more livable, sustainable, and connected. We believe in the power of
            smart solutions to create better communities for everyone.
          </p>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p>Email: contact@roadsync.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Innovation Street, Smart City, SC 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}