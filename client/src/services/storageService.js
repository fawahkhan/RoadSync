// Central Local Storage & State Management for RoadSync v2
// Fully functional offline-first storage for Hazards, Trips, User Profile, and Emergency Contacts.

const HAZARDS_STORAGE_KEY = 'roadsync_hazards_v2';
const TRIPS_STORAGE_KEY = 'roadsync_trips_v2';
const PROFILE_STORAGE_KEY = 'roadsync_profile_v2';
const CONTACTS_STORAGE_KEY = 'roadsync_emergency_contacts_v2';

// Realistic initial seed hazards matching the reference mockups
const DEFAULT_HAZARDS = [
  {
    id: 'hz-1',
    category: 'accident',
    title: 'Accident on Outer Ring Road',
    locationName: 'Outer Ring Road, Near Pitampura',
    lat: 28.6990,
    lng: 77.1384,
    description: 'Two cars involved in minor collision. Right lane blocked, traffic moving slowly. Drive carefully.',
    severity: 'high',
    author: 'Rohan S.',
    verifiedAuthor: true,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    upvotes: 24,
    downvotes: 1,
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    comments: [
      { id: 'c1', author: 'Rohit S.', text: 'Right lane blocked, Police on site.', time: '5 min ago' },
      { id: 'c2', author: 'Ananya M.', text: 'Heavy traffic buildup. Take alternate service lane.', time: '8 min ago' }
    ]
  },
  {
    id: 'hz-2',
    category: 'pothole',
    title: 'Deep Pothole on Left Lane',
    locationName: 'Ring Road, Near Kalkaji Flyover',
    lat: 28.5482,
    lng: 77.2514,
    description: 'Deep trench-like pothole hidden after rain. Damaged two car rims already.',
    severity: 'medium',
    author: 'Priya K.',
    verifiedAuthor: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    upvotes: 19,
    downvotes: 0,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    comments: [
      { id: 'c3', author: 'Vikram D.', text: 'Still there! Swerve carefully.', time: '6 min ago' }
    ]
  },
  {
    id: 'hz-3',
    category: 'construction',
    title: 'Flyover Pillar Repair Work',
    locationName: 'Vasant Kunj Marg, Sector B',
    lat: 28.5244,
    lng: 77.1588,
    description: 'Barricaded construction zone for metro pillar work. Speed limit 20 km/h.',
    severity: 'medium',
    author: 'Amit V.',
    verifiedAuthor: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    upvotes: 31,
    downvotes: 2,
    imageUrl: null,
    comments: []
  },
  {
    id: 'hz-4',
    category: 'flooding',
    title: 'Severe Waterlogging Underpass',
    locationName: 'Minto Bridge Underpass',
    lat: 28.6349,
    lng: 77.2258,
    description: 'Water depth approximately 2 feet. Low clearance sedans should avoid completely.',
    severity: 'high',
    author: 'Karan N.',
    verifiedAuthor: true,
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    upvotes: 45,
    downvotes: 0,
    imageUrl: null,
    comments: [
      { id: 'c4', author: 'Suresh T.', text: 'Buses turning back. Total gridlock.', time: '12 min ago' }
    ]
  },
  {
    id: 'hz-5',
    category: 'traffic',
    title: 'Massive Traffic Congestion',
    locationName: 'Dhaula Kuan Intersection',
    lat: 28.5921,
    lng: 77.1610,
    description: 'Bumper to bumper traffic heading towards airport. Expected delay 35 mins.',
    severity: 'medium',
    author: 'Deepak G.',
    verifiedAuthor: false,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    upvotes: 14,
    downvotes: 1,
    imageUrl: null,
    comments: []
  }
];

// Seed trips matching the user's reference mockup
const DEFAULT_TRIPS = [
  {
    id: 'trip-1',
    from: 'Delhi (Connaught Place)',
    to: 'Jaipur, Rajasthan',
    fromCoords: [28.6315, 77.2167],
    toCoords: [26.9124, 75.7873],
    distanceKm: 280,
    durationText: '5h 15m',
    mode: 'car',
    fuelType: 'Petrol',
    mileage: 15,
    passengers: 4,
    fuelCost: 2450,
    tolls: 550,
    totalCost: 3000,
    perPersonCost: 750,
    participants: [
      { name: 'You', amount: 750, isUser: true },
      { name: 'Rohit', amount: 750 },
      { name: 'Ananya', amount: 750 },
      { name: 'Karan', amount: 750 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DEFAULT_PROFILE = {
  name: 'Rohan Sharma',
  tagline: 'Fellow Traveller',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  tripsCount: 12,
  reportsCount: 8,
  communityScore: 4.8,
  verifiedReporter: true
};

const DEFAULT_EMERGENCY_CONTACTS = [
  { id: 'ec-1', name: 'Father (Rajesh)', phone: '+91 98100 12345', relationship: 'Parent' },
  { id: 'ec-2', name: 'Pooja (Wife)', phone: '+91 98200 67890', relationship: 'Spouse' }
];

export const StorageService = {
  // HAZARDS API
  getHazards() {
    const raw = localStorage.getItem(HAZARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HAZARDS_STORAGE_KEY, JSON.stringify(DEFAULT_HAZARDS));
      return DEFAULT_HAZARDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_HAZARDS;
    }
  },

  saveHazards(hazards) {
    localStorage.setItem(HAZARDS_STORAGE_KEY, JSON.stringify(hazards));
  },

  addHazard(newHazard) {
    const list = this.getHazards();
    const hazard = {
      id: 'hz-' + Date.now(),
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      comments: [],
      author: 'You',
      verifiedAuthor: true,
      ...newHazard
    };
    list.unshift(hazard);
    this.saveHazards(list);

    // Bump profile reports count
    const profile = this.getProfile();
    profile.reportsCount = (profile.reportsCount || 0) + 1;
    this.saveProfile(profile);

    return hazard;
  },

  upvoteHazard(id) {
    const list = this.getHazards();
    const item = list.find(h => h.id === id);
    if (item) {
      item.upvotes = (item.upvotes || 0) + 1;
      this.saveHazards(list);
    }
    return item;
  },

  downvoteHazard(id) {
    const list = this.getHazards();
    const item = list.find(h => h.id === id);
    if (item) {
      item.downvotes = (item.downvotes || 0) + 1;
      this.saveHazards(list);
    }
    return item;
  },

  addComment(hazardId, text, author = 'You') {
    const list = this.getHazards();
    const item = list.find(h => h.id === hazardId);
    if (item) {
      item.comments = item.comments || [];
      item.comments.unshift({
        id: 'c-' + Date.now(),
        author,
        text,
        time: 'Just now'
      });
      this.saveHazards(list);
    }
    return item;
  },

  // TRIPS API
  getTrips() {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(DEFAULT_TRIPS));
      return DEFAULT_TRIPS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TRIPS;
    }
  },

  saveTrip(trip) {
    const list = this.getTrips();
    const newTrip = {
      id: 'trip-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...trip
    };
    list.unshift(newTrip);
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(list));

    // Bump profile trips count
    const profile = this.getProfile();
    profile.tripsCount = (profile.tripsCount || 0) + 1;
    this.saveProfile(profile);

    return newTrip;
  },

  deleteTrip(id) {
    const list = this.getTrips().filter(t => t.id !== id);
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(list));
    return list;
  },

  // PROFILE API
  getProfile() {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  },

  // EMERGENCY CONTACTS
  getEmergencyContacts() {
    const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(DEFAULT_EMERGENCY_CONTACTS));
      return DEFAULT_EMERGENCY_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_EMERGENCY_CONTACTS;
    }
  },

  addEmergencyContact(contact) {
    const list = this.getEmergencyContacts();
    const newContact = {
      id: 'ec-' + Date.now(),
      ...contact
    };
    list.push(newContact);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(list));
    return list;
  },

  deleteEmergencyContact(id) {
    const list = this.getEmergencyContacts().filter(c => c.id !== id);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(list));
    return list;
  }
};
