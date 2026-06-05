// CO2 emission factors in grams per litre of fuel
// Source: IPCC Guidelines for National Greenhouse Gas Inventories
const EMISSION_FACTORS = {
  petrol: 2310,   // 2310g CO2 per litre of petrol
  diesel: 2680,   // 2680g CO2 per litre of diesel
  cng: 1960,      // Per kg (approximated as per litre equivalent)
  electric: 0,    // Zero direct emissions
  hybrid: 1500,   // Approximate average
};

/**
 * Calculate CO2 emissions for a trip
 * @param {Object} vehicle - { fuelType, mileage (km/L) }
 * @param {Object} trip - { distanceKm }
 * @returns {Object} { co2Grams, fuelConsumedLitres }
 */
export const calculate = (vehicle, trip) => {
  const { fuelType, mileage } = vehicle;
  const { distanceKm } = trip;

  if (fuelType === 'electric') {
    return { co2Grams: 0, fuelConsumedLitres: 0 };
  }

  if (!mileage || mileage <= 0) {
    throw new Error('Mileage must be a positive number');
  }

  // Fuel consumed = distance ÷ mileage (km/L)
  const fuelConsumedLitres = distanceKm / mileage;

  // CO2 = fuel consumed × emission factor
  const co2Grams = Math.round(fuelConsumedLitres * (EMISSION_FACTORS[fuelType] || EMISSION_FACTORS.petrol));

  return { co2Grams, fuelConsumedLitres: Math.round(fuelConsumedLitres * 100) / 100 };
};

/**
 * Determine gems to award based on emission level
 */
export const calculateGems = (co2Grams) => {
  if (co2Grams === 0) return 100;      // Electric vehicle bonus
  if (co2Grams < 2000) return 50;      // Very low emissions
  if (co2Grams < 5000) return 20;      // Moderate emissions
  if (co2Grams < 10000) return 10;     // Average emissions
  return 5;                             // High emissions — still get something
};
