import { Link } from 'react-router-dom';
import { Navigation2, Car, Leaf, ShieldAlert, MapPin, MessageSquare, Wrench, ArrowRight, ChevronRight, Users } from 'lucide-react';
import Footer from '../components/Footer';
import heroImage from '../assets/hero_clean_city.png';

export default function Landing() {

  const features = [
    { icon: Car, title: 'Smart Parking', description: 'Find available parking spots in real time. Enter your location, pick a time slot, and book instantly — no circling the block.', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Leaf, title: 'CO₂ Emission Tracker', description: 'Log your trips with vehicle details and get instant carbon footprint calculations. See how you compare to other users and earn gems for eco-friendly driving.', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: ShieldAlert, title: 'Incident Reporting', description: 'Witnessed an accident or emergency? Report it in seconds with location, description, and photo evidence. Help keep your community safe.', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: MapPin, title: 'Route Optimization', description: 'Get turn-by-turn directions with real-time traffic data. Choose between driving, transit, walking, or cycling and see traffic signals and tolls ahead.', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: MessageSquare, title: 'AI Assistant', description: 'Chat with our Gemini-powered AI about traffic, parking tips, emission reduction strategies, or finding nearby services. Available 24/7.', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Wrench, title: 'Public Utilities', description: 'Locate hospitals, pharmacies, petrol stations, and police stations near you on an interactive map with ratings and distance info.', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const steps = [
    { num: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds with just your name, email and password.' },
    { num: '02', title: 'Use the tools you need', desc: 'Book parking, track emissions, report incidents, optimize routes — all from one dashboard.' },
    { num: '03', title: 'Earn rewards & make impact', desc: 'Collect gems and badges for eco-driving and community contributions. Climb the leaderboard.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Navigation2 className="text-teal-600" size={26} />
            <span className="text-lg font-bold text-gray-900 tracking-tight">RoadSync</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href="#features" className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
            <Link to="/auth" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link to="/auth" className="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              Urban mobility, reimagined
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-6 tracking-tight">
              Navigate smarter.<br />Live greener.<br />Stay safer.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              RoadSync brings parking, emissions tracking, incident reporting, route planning, and an AI assistant into one platform — so you can move through your city with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-base">
                Start for free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-base">
                See all features
              </a>
            </div>
          </div>
          <div>
            <img src={heroImage} alt="RoadSync platform overview" className="w-full rounded-2xl border border-gray-200 shadow-lg" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, value: '10,000+', label: 'Active users' },
            { icon: Car, value: '25,000+', label: 'Parking sessions' },
            { icon: Leaf, value: '4.2 tons', label: 'CO₂ tracked' },
            { icon: ShieldAlert, value: '1,200+', label: 'Incidents reported' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <stat.icon size={22} className="text-teal-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need, in one place</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Each tool is designed to solve a real urban problem. Here's exactly what you can do with RoadSync.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
              <div className={`inline-flex p-3 rounded-lg ${f.bg} mb-4`}>
                <f.icon size={22} className={f.color} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.description}</p>
              <Link to="/auth" className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium hover:gap-2 transition-all">
                Try it <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get started in 3 steps</h2>
            <p className="text-gray-500 text-lg">No setup, no downloads, no credit card. Just sign up and go.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i}>
                <span className="text-5xl font-extrabold text-gray-100 select-none">{step.num}</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Drive green. Earn rewards.</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Every trip you log, every incident you report, and every eco-friendly choice you make earns you <strong className="text-gray-900">gems</strong> and <strong className="text-gray-900">badges</strong>.
              Compete with other citizens on the leaderboard and watch your impact grow.
            </p>
            <div className="flex flex-wrap gap-3">
              {['💎 Earn Gems', '🏆 Collect Badges', '📊 Climb Leaderboard'].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-900">{item}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[{ emoji: '💎', val: '550', label: 'Gems earned' }, { emoji: '🏆', val: '15', label: 'Badges' }, { emoji: '🌍', val: '#42', label: 'Rank' }].map((d, i) => (
              <div key={i}>
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-2xl mx-auto mb-2">{d.emoji}</div>
                <p className="font-bold text-gray-900">{d.val}</p>
                <p className="text-xs text-gray-500">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to make your city smarter?</h2>
          <p className="text-gray-400 text-lg mb-8">Join RoadSync today. It's free, it's fast, and it makes a real difference.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-lg">
            Create free account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}