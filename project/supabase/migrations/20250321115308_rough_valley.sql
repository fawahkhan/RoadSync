-- Users Profile Table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text,
  gems integer DEFAULT 0,
  badges integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users_profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users_profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Parking Spots Table
CREATE TABLE IF NOT EXISTS parking_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  total_spaces integer NOT NULL,
  available_spaces integer NOT NULL,
  price_per_hour decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parking spots"
  ON parking_spots
  FOR SELECT
  TO authenticated
  USING (true);

-- Parking Bookings Table
CREATE TABLE IF NOT EXISTS parking_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  spot_id uuid REFERENCES parking_spots(id),
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parking_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON parking_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON parking_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Emissions Table
CREATE TABLE IF NOT EXISTS emissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  fuel_type text NOT NULL,
  distance numeric NOT NULL,
  mileage numeric NOT NULL,
  co2_emissions numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emissions"
  ON emissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create emission records"
  ON emissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Crime Reports Table
CREATE TABLE IF NOT EXISTS crime_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  report_type text NOT NULL,
  location text NOT NULL,
  description text,
  report_date date NOT NULL,
  report_time time NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crime_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON crime_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports"
  ON crime_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  badge_icon text,
  gems_reward integer DEFAULT 0,
  achieved_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);