// src/scripts/races.js
// Races Page - F1 Race Calendar & Results

console.log('🚀 races.js loaded');

// ===== DOM ELEMENTS =====
const yearSpan = document.getElementById('currentYear');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const container = document.getElementById('races-container');
const seasonSelect = document.getElementById('seasonSelect');
const raceFilter = document.getElementById('raceFilter');
const searchInput = document.getElementById('searchRace');

console.log('📄 DOM elements found:', {
    yearSpan: !!yearSpan,
    hamburger: !!hamburger,
    navMenu: !!navMenu,
    container: !!container,
    seasonSelect: !!seasonSelect,
    raceFilter: !!raceFilter,
    searchInput: !!searchInput
});

// ===== SET CURRENT YEAR =====
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
    console.log('✅ Year set to:', yearSpan.textContent);
}

// ===== HAMBURGER MENU =====
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });
    console.log('✅ Hamburger menu initialized');
}

// ===== MODAL MANAGER =====
class ModalManager {
    constructor(modalElement) {
        this.modal = modalElement;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const closeBtn = this.modal?.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.open) {
                this.close();
            }
        });
    }
    
    open(content) {
        const contentDiv = this.modal?.querySelector('#modalContent');
        if (contentDiv && content) {
            contentDiv.innerHTML = content;
        }
        this.modal?.showModal();
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal?.close();
        document.body.style.overflow = '';
    }
}

const raceModal = document.getElementById('raceModal');
let raceModalManager = null;
if (raceModal) {
    raceModalManager = new ModalManager(raceModal);
}

// ===== ATTRIBUTIONS MODAL =====
const attributionLink = document.getElementById('attributionLink');
const attributionModal = document.getElementById('attributionModal');
if (attributionLink && attributionModal) {
    const attrManager = new ModalManager(attributionModal);
    attributionLink.addEventListener('click', (e) => {
        e.preventDefault();
        attrManager.open(attributionModal.querySelector('#modalContent').innerHTML);
    });
}

// ===== GET FLAG EMOJI =====
function getFlagEmoji(country) {
    const flags = {
        'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Azerbaijan': '🇦🇿',
        'Bahrain': '🇧🇭', 'Belgium': '🇧🇪', 'Brazil': '🇧🇷',
        'Canada': '🇨🇦', 'China': '🇨🇳', 'Denmark': '🇩🇰',
        'Finland': '🇫🇮', 'France': '🇫🇷', 'Germany': '🇩🇪',
        'Hungary': '🇭🇺', 'Italy': '🇮🇹', 'Japan': '🇯🇵',
        'Mexico': '🇲🇽', 'Monaco': '🇲🇨', 'Netherlands': '🇳🇱',
        'Portugal': '🇵🇹', 'Saudi Arabia': '🇸🇦', 'Singapore': '🇸🇬',
        'Spain': '🇪🇸', 'Switzerland': '🇨🇭', 'Turkey': '🇹🇷',
        'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧',
        'USA': '🇺🇸', 'United States': '🇺🇸'
    };
    return flags[country] || '🏁';
}

// ===== TEST API DIRECTLY =====
async function testAPI() {
    console.log('🔧 Testing API connection...');
    const API_KEY = '0ac923f5b1467ab0bc5ae07e6d092c53';
    
    try {
        const response = await fetch('https://v1.formula-1.api-sports.io/races?season=2024', {
            headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();
        console.log('📦 API Test Result:', data);
        
        if (data.response && data.response.length > 0) {
            console.log(`✅ API works! Found ${data.response.length} sessions`);
            return data;
        } else {
            console.warn('⚠️ API returned no races:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ API Test Failed:', error);
        return null;
    }
}

// ===== LOAD RACES =====
async function loadRaces() {
    if (!container) {
        console.error('❌ Container not found!');
        return;
    }
    
    console.log('🏎️ loadRaces() started...');
    container.innerHTML = '<div class="loading-spinner">🏎️ Loading races...</div>';
    
    try {
        // Get selected season
        const season = seasonSelect ? parseInt(seasonSelect.value) : 2024;
        console.log(`📡 Fetching races for season ${season}...`);
        
        const API_KEY = '0ac923f5b1467ab0bc5ae07e6d092c53';
        const response = await fetch(`https://v1.formula-1.api-sports.io/races?season=${season}`, {
            headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();
        
        console.log('📦 API Response:', data);
        
        if (!data || !data.response || data.response.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    ⚠️ No races found for ${season}.
                    <br><br>
                    <small>Try a different season.</small>
                </div>
            `;
            return;
        }
        
        // 🔥 KEY FIX: Filter to only show main "Race" sessions
        // Also filter out duplicates by competition name
        const mainRaces = data.response.filter(race => {
            // Only include "Race" type (not Practice, Qualifying, Sprint, etc.)
            return race.type === 'Race';
        });
        
        console.log(`✅ Found ${data.response.length} total sessions, ${mainRaces.length} main races`);
        
        if (mainRaces.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    ⚠️ No main races found for ${season}.
                    <br><br>
                    <small>Try a different season.</small>
                </div>
            `;
            return;
        }
        
        // Store all races
        window.allRaces = mainRaces;
        
        // Update heading with season
        const heading = document.querySelector('main h1');
        if (heading) {
            heading.textContent = `Formula 1 Race Calendar ${season}`;
        }
        
        // Apply filters
        applyFilters();
        
    } catch (error) {
        console.error('❌ Error loading races:', error);
        container.innerHTML = `
            <div class="error-message">
                ⚠️ Failed to load races: ${error.message}
                <br><br>
                <small>Check the browser console (F12) for more details.</small>
            </div>
        `;
    }
}

// ===== APPLY FILTERS =====
function applyFilters() {
    if (!window.allRaces) return;
    
    const filterType = raceFilter?.value || 'all';
    const searchValue = searchInput?.value.toLowerCase() || '';
    
    let filtered = [...window.allRaces];
    
    // Filter by type (if we had different types, but we already filtered to Race)
    if (filterType !== 'all') {
        filtered = filtered.filter(race => race.type === filterType);
    }
    
    // Filter by search (circuit name or location)
    if (searchValue) {
        filtered = filtered.filter(race => {
            const circuitName = race.circuit?.name?.toLowerCase() || '';
            const location = race.circuit?.location?.toLowerCase() || '';
            const competitionName = race.competition?.name?.toLowerCase() || '';
            return circuitName.includes(searchValue) || 
                   location.includes(searchValue) || 
                   competitionName.includes(searchValue);
        });
    }
    
    displayRaces(filtered);
}

// ===== DISPLAY RACES =====
function displayRaces(races) {
    if (!container) return;
    
    console.log('📊 Displaying', races.length, 'races');
    
    if (!races || races.length === 0) {
        container.innerHTML = '<div class="no-results">🔍 No races found matching your criteria</div>';
        return;
    }
    
    const racesHTML = races.map((race, index) => {
        const date = new Date(race.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const circuitName = race.circuit?.name || 'Unknown Circuit';
        const location = race.circuit?.location || 'Unknown Location';
        const country = race.circuit?.country || '';
        const flag = getFlagEmoji(country);
        
        // Determine status
        const status = race.status || 'Scheduled';
        const statusClass = status.toLowerCase();
        
        // Get winner if available
        let winner = null;
        if (race.results && race.results.length > 0) {
            const winnerResult = race.results.find(r => r.position === 1);
            if (winnerResult) {
                winner = winnerResult.driver?.name || 'Unknown';
            }
        }
        
        return `
            <div class="race-card" data-race-id="${race.id}">
                <div class="race-header">
                    <span class="race-round">Round ${race.round || index + 1}</span>
                    <span class="race-status ${statusClass}">${status}</span>
                </div>
                
                <div class="race-name">${race.competition?.name || 'Grand Prix'}</div>
                
                <div class="race-circuit">
                    <span class="flag">${flag}</span>
                    ${circuitName} - ${location}
                </div>
                
                <div class="race-details">
                    <span><span class="icon">📅</span> ${formattedDate}</span>
                    <span><span class="icon">🕐</span> ${race.time || 'TBD'}</span>
                </div>
                
                ${winner ? `
                    <div class="race-result">
                        <div class="race-winner">
                            <span class="trophy">🏆</span>
                            Winner: ${winner}
                        </div>
                    </div>
                ` : `
                    <div class="race-result">
                        <div class="race-winner" style="color: #888;">
                            ⏳ Results pending
                        </div>
                    </div>
                `}
                
                <button class="details-btn" data-race='${JSON.stringify(race).replace(/'/g, "&#39;")}'>
                    📋 Race Details
                </button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = racesHTML;
    console.log('✅ Races displayed!');
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const race = JSON.parse(btn.dataset.race);
            showRaceDetails(race);
        });
    });
}

// ===== SHOW RACE DETAILS =====
function showRaceDetails(race) {
    if (!raceModalManager) return;
    
    const date = new Date(race.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    const country = race.circuit?.country || '';
    const flag = getFlagEmoji(country);
    
    // Get winner and podium
    let winner = null;
    let podium = [];
    if (race.results && race.results.length > 0) {
        winner = race.results.find(r => r.position === 1);
        podium = race.results.filter(r => r.position <= 3);
    }
    
    const modalContent = `
        <div class="race-detail">
            <h2>${race.competition?.name || 'Grand Prix'}</h2>
            
            <div class="detail-row">
                <span class="label">📍 Circuit</span>
                <span class="value">${race.circuit?.name || 'Unknown'}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">🌍 Location</span>
                <span class="value">${race.circuit?.location || 'Unknown'} ${flag}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">📅 Date</span>
                <span class="value">${formattedDate}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">🕐 Time</span>
                <span class="value">${race.time || 'TBD'}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">📊 Status</span>
                <span class="value">${race.status || 'Scheduled'}</span>
            </div>
            
            ${winner ? `
                <div class="detail-row" style="border-bottom: none; padding-top: 15px;">
                    <span class="label">🏆 Winner</span>
                    <span class="value" style="color: #ffd700;">${winner.driver?.name || 'Unknown'}</span>
                </div>
            ` : ''}
            
            ${podium.length > 0 ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <strong style="color: #ffd700;">🥇 Podium</strong>
                    ${podium.map((p, i) => `
                        <div class="detail-row" style="border-bottom: none; padding: 5px 0;">
                            <span class="label">${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${p.driver?.name || 'Unknown'}</span>
                            <span class="value">${p.team?.name || ''}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${race.laps ? `
                <div class="detail-row">
                    <span class="label">🔄 Laps</span>
                    <span class="value">${race.laps}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    raceModalManager.open(modalContent);
}

// ===== POPULATE SEASON SELECT =====
async function populateSeasonSelect() {
    console.log('📅 Populating season select...');
    
    if (!seasonSelect) {
        console.error('❌ Season select not found!');
        return;
    }
    
    try {
        const API_KEY = '0ac923f5b1467ab0bc5ae07e6d092c53';
        const response = await fetch('https://v1.formula-1.api-sports.io/seasons', {
            headers: { 'x-apisports-key': API_KEY }
        });
        const data = await response.json();
        
        console.log('📅 Seasons response:', data);
        
        if (data.response && data.response.length > 0) {
            // Clear existing options
            while (seasonSelect.options.length > 0) {
                seasonSelect.remove(0);
            }
            
            // Add seasons in descending order
            const seasons = data.response.sort((a, b) => b - a);
            seasons.forEach(season => {
                const option = document.createElement('option');
                option.value = season;
                option.textContent = season;
                seasonSelect.appendChild(option);
            });
            
            // Set to latest
            const latest = seasons[0] || 2024;
            seasonSelect.value = latest;
            console.log(`✅ Seasons loaded: ${seasons.join(', ')}`);
        }
    } catch (error) {
        console.error('❌ Error loading seasons:', error);
        // Fallback
        [2024, 2023, 2022, 2021].forEach(season => {
            const option = document.createElement('option');
            option.value = season;
            option.textContent = season;
            seasonSelect.appendChild(option);
        });
        seasonSelect.value = 2024;
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM loaded, initializing races page...');
    
    // Populate season select
    await populateSeasonSelect();
    
    // Load races
    await loadRaces();
    
    // Set up event listeners
    if (seasonSelect) {
        seasonSelect.addEventListener('change', loadRaces);
        console.log('✅ Season select listener added');
    }
    
    if (raceFilter) {
        raceFilter.addEventListener('change', applyFilters);
        console.log('✅ Race filter listener added');
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        console.log('✅ Search listener added');
    }
    
    console.log('✅ Races page initialized!');
});

// ===== EXPOSE FOR DEBUGGING =====
window.__races = {
    loadRaces,
    displayRaces,
    applyFilters
};

console.log('🏁 races.js loaded successfully!');