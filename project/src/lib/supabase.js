import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Present' : 'Missing',
    key: supabaseAnonKey ? 'Present' : 'Missing'
  });
}

console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});

// Helper functions for data operations
export const api = {
  // User Profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  // Parking
  async getParkingSpots() {
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createParkingBooking(spotId, checkIn, checkOut) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('parking_bookings')
      .insert([
        {
          spot_id: spotId,
          check_in: checkIn,
          check_out: checkOut,
          user_id: user.id,
        },
      ])
      .single();
    if (error) throw error;
    return data;
  },

  // Emissions
  async saveEmissionData(fuelType, distance, mileage) {
    const { data: { user } } = await supabase.auth.getUser();
    const co2_emissions = calculateCO2Emissions(fuelType, distance, mileage);
    const { data, error } = await supabase
      .from('emissions')
      .insert([
        {
          fuel_type: fuelType,
          distance: distance,
          mileage: mileage,
          co2_emissions: co2_emissions,
          user_id: user.id,
        },
      ]);
    if (error) throw error;
    return data;
  },

  async getUserEmissions(userId) {
    const { data, error } = await supabase
      .from('emissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Crime Reports
  async submitCrimeReport(reportData) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('crime_reports')
      .insert([
        {
          ...reportData,
          user_id: user.id,
        },
      ]);
    if (error) throw error;
    return data;
  },

  async getUserReports(userId) {
    const { data, error } = await supabase
      .from('crime_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Achievements
  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Utility function to calculate CO2 emissions
function calculateCO2Emissions(fuelType, distance, mileage) {
  // Basic calculation - can be made more sophisticated
  const fuelConsumption = distance / mileage;
  const emissionFactors = {
    petrol: 2.31, // kg CO2 per liter
    diesel: 2.68,
    cng: 1.81,
    electric: 0,
  };
  return fuelConsumption * (emissionFactors[fuelType.toLowerCase()] || 2.31);
}