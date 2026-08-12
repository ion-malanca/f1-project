const API_KEY = '0ac923f5b1467ab0bc5ae07e6d092c53';
const BASE_URL = 'https://v1.formula-1.api-sports.io';

// ============================================
// HELPER FUNCTION
// ============================================
async function fetchF1Data(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString 
    ? `${BASE_URL}${endpoint}?${queryString}`
    : `${BASE_URL}${endpoint}`;
  
  console.log(`📡 Fetching: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: { 
        'x-apisports-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📦 Response received');
    
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('⚠️ API Errors:', data.errors);
      return { error: data.errors, response: [] };
    }
    
    if (!data.response) {
      console.warn('⚠️ No response field in data');
      return { response: [] };
    }
    
    return data;
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    return { error: [error.message], response: [] };
  }
}

// ============================================
// SEASONS ENDPOINTS
// ============================================

/**
 * Get all available seasons
 * No parameters required
 */
export async function getSeasons() {
  return fetchF1Data('/seasons');
}

// ============================================
// COMPETITIONS ENDPOINTS
// ============================================

/**
 * Get list of available competitions (races)
 * @param {Object} params - Optional parameters
 * @param {number} params.id - Competition ID
 * @param {string} params.name - Competition name
 * @param {string} params.country - Country name
 * @param {string} params.city - City name
 * @param {string} params.search - Search term (min 3 chars)
 */
export async function getCompetitions(params = {}) {
  return fetchF1Data('/competitions', params);
}

// ============================================
// CIRCUITS ENDPOINTS
// ============================================

/**
 * Get list of available circuits
 * @param {Object} params - Optional parameters
 * @param {number} params.id - Circuit ID
 * @param {number} params.competition - Competition ID
 * @param {string} params.name - Circuit name
 * @param {string} params.search - Search term (min 3 chars)
 */
export async function getCircuits(params = {}) {
  return fetchF1Data('/circuits', params);
}

// ============================================
// TEAMS ENDPOINTS
// ============================================

/**
 * Get list of available teams
 * @param {Object} params - Optional parameters
 * @param {number} params.id - Team ID
 * @param {string} params.name - Team name
 * @param {string} params.search - Search term (min 3 chars)
 */
export async function getTeams(params = {}) {
  return fetchF1Data('/teams', params);
}

/**
 * Get a specific team by ID
 * @param {number} id - Team ID
 */
export async function getTeamById(id) {
  return fetchF1Data('/teams', { id });
}

// ============================================
// DRIVERS ENDPOINTS
// ============================================

/**
 * Get list of available drivers
 * ⚠️ REQUIRES at least one parameter!
 * @param {Object} params - Required parameters
 * @param {number} params.id - Driver ID
 * @param {string} params.name - Driver name
 * @param {string} params.search - Search term (min 3 chars)
 */
export async function getDrivers(params = {}) {
  // The API requires at least one parameter
  // If no params provided, use a default search
  if (Object.keys(params).length === 0) {
    params = { search: 'a' }; // 'a' returns many drivers
  }
  return fetchF1Data('/drivers', params);
}

/**
 * Search drivers by name
 * @param {string} name - Name to search for (min 3 chars)
 */
export async function searchDrivers(name) {
  if (!name || name.length < 1) {
    return fetchF1Data('/drivers', { search: 'a' });
  }
  return fetchF1Data('/drivers', { search: name });
}

/**
 * Get a specific driver by ID
 * @param {number} id - Driver ID
 */
export async function getDriverById(id) {
  return fetchF1Data('/drivers', { id });
}

// ============================================
// RACES ENDPOINTS
// ============================================

/**
 * Get list of available races
 * @param {Object} params - Parameters
 * @param {number} params.id - Race ID
 * @param {string} params.date - Date (YYYY-MM-DD)
 * @param {number} params.next - Number of next races
 * @param {number} params.last - Number of last races
 * @param {number} params.competition - Competition ID
 * @param {number} params.circuit - Circuit ID
 * @param {number} params.season - Season year (YYYY)
 * @param {string} params.type - Race type (Race, 1st Qualifying, Sprint, etc.)
 * @param {string} params.timezone - Timezone (e.g., Europe/London)
 */
// In api.js - Update this function
export async function getRaces(params = {}) {
  if (Object.keys(params).length === 0) {
    params = { season: 2024 };
  }
  console.log('📡 Fetching races with params:', params);
  return fetchF1Data('/races', params);
}

/**
 * Get upcoming races
 * @param {number} count - Number of upcoming races to fetch
 * @param {string} timezone - Timezone (default: Europe/London)
 */
export async function getUpcomingRaces(count = 5, timezone = 'Europe/London') {
  return fetchF1Data('/races', { 
    next: count, 
    timezone: timezone 
  });
}

/**
 * Get last races
 * @param {number} count - Number of last races to fetch
 * @param {string} timezone - Timezone (default: Europe/London)
 */
export async function getLastRaces(count = 5, timezone = 'Europe/London') {
  return fetchF1Data('/races', { 
    last: count, 
    timezone: timezone 
  });
}

/**
 * Get races for a specific season
 * @param {number} season - Season year
 */
export async function getSeasonRaces(season = 2024) {
  return fetchF1Data('/races', { season });
}

// ============================================
// RANKINGS ENDPOINTS
// ============================================

/**
 * Get driver rankings for a season
 * @param {number} season - Season year (default: 2024)
 * @param {Object} params - Additional parameters
 * @param {number} params.driver - Driver ID
 * @param {number} params.team - Team ID
 */
export async function getDriverStandings(season = 2024, params = {}) {
  return fetchF1Data('/rankings/drivers', { season, ...params });
}

/**
 * Get team rankings for a season
 * @param {number} season - Season year (default: 2024)
 * @param {Object} params - Additional parameters
 * @param {number} params.team - Team ID
 */
export async function getTeamStandings(season = 2024, params = {}) {
  return fetchF1Data('/rankings/teams', { season, ...params });
}

/**
 * Get fastest laps for a race
 * @param {number} raceId - Race ID (required)
 * @param {Object} params - Additional parameters
 * @param {number} params.driver - Driver ID
 * @param {number} params.team - Team ID
 */
export async function getFastestLaps(raceId, params = {}) {
  return fetchF1Data('/rankings/fastestlaps', { race: raceId, ...params });
}

/**
 * Get starting grid for a race
 * @param {number} raceId - Race ID (required)
 * @param {Object} params - Additional parameters
 * @param {number} params.driver - Driver ID
 * @param {number} params.team - Team ID
 */
export async function getStartingGrid(raceId, params = {}) {
  return fetchF1Data('/rankings/startinggrid', { race: raceId, ...params });
}

// ============================================
// PIT STOPS ENDPOINTS
// ============================================

/**
 * Get pit stops for a race
 * @param {number} raceId - Race ID (required)
 * @param {Object} params - Additional parameters
 * @param {number} params.driver - Driver ID
 * @param {number} params.team - Team ID
 */
export async function getPitStops(raceId, params = {}) {
  return fetchF1Data('/pitstops', { race: raceId, ...params });
}

// ============================================
// TIMEZONE ENDPOINTS
// ============================================

/**
 * Get list of available timezones
 * No parameters required
 */
export async function getTimezones() {
  return fetchF1Data('/timezone');
}

// ============================================
// STATUS ENDPOINTS
// ============================================

/**
 * Get account status and quota information
 * Does NOT count against daily quota
 */
export async function getStatus() {
  return fetchF1Data('/status');
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
  // Seasons
  getSeasons,
  
  // Competitions
  getCompetitions,
  
  // Circuits
  getCircuits,
  
  // Teams
  getTeams,
  getTeamById,
  
  // Drivers
  getDrivers,
  searchDrivers,
  getDriverById,
  
  // Races
  getRaces,
  getUpcomingRaces,
  getLastRaces,
  getSeasonRaces,
  
  // Rankings
  getDriverStandings,
  getTeamStandings,
  getFastestLaps,
  getStartingGrid,
  
  // Pit Stops
  getPitStops,
  
  // Timezones
  getTimezones,
  
  // Status
  getStatus
};