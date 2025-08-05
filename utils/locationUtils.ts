/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get a user-friendly distance string
 */
export function getDistanceString(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  }
  return `${distanceKm.toFixed(1)}km away`;
}

/**
 * Check if a location is within a radius of another location
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
}

/**
 * Calculate a similarity score between two users based on hobbies and sports
 * Returns a number between 0 and 1
 */
export function calculateSimilarityScore(
  userHobbies: string[],
  userSports: string[],
  otherHobbies: string[],
  otherSports: string[]
): number {
  // Find common interests
  const commonHobbies = userHobbies.filter(hobby => 
    otherHobbies.includes(hobby)
  );
  
  const commonSports = userSports.filter(sport => 
    otherSports.includes(sport)
  );
  
  // Calculate total unique interests
  const totalUniqueHobbies = new Set([...userHobbies, ...otherHobbies]).size;
  const totalUniqueSports = new Set([...userSports, ...otherSports]).size;
  
  // Avoid division by zero
  if (totalUniqueHobbies === 0 && totalUniqueSports === 0) {
    return 0;
  }
  
  // Weight hobbies and sports equally (50% each)
  const hobbyScore = totalUniqueHobbies > 0 
    ? (commonHobbies.length / totalUniqueHobbies) * 0.5 
    : 0;
    
  const sportScore = totalUniqueSports > 0 
    ? (commonSports.length / totalUniqueSports) * 0.5 
    : 0;
  
  // Return combined score (0-1)
  return hobbyScore + sportScore;
}