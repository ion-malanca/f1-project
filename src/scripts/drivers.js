const STORAGE_KEYS = {
    FAVORITE_DRIVERS: 'favoriteDrivers',
    USER_PREFERENCES: 'userPreferences'
};

let allDrivers = [];


const yearSpan = document.getElementById('currentYear');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const driverModal = document.getElementById('driverModal');
const container = document.getElementById('drivers-container');
const searchInput = document.getElementById('search');
const teamFilter = document.getElementById('teamFilter');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}


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
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function addFavorite(driverName) {
    let favorites = getFromLocalStorage(STORAGE_KEYS.FAVORITE_DRIVERS) || [];
    if (!favorites.includes(driverName)) {
        favorites.push(driverName);
        saveToLocalStorage(STORAGE_KEYS.FAVORITE_DRIVERS, favorites);
        return true;
    }
    return false;
}


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

let driverModalManager = null;
if (driverModal) {
    driverModalManager = new ModalManager(driverModal);
}


function showToast(message, color = '#00ff00') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color === '#00ff00' ? 'rgba(0,100,0,0.9)' : 'rgba(100,100,0,0.9)'};
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        z-index: 2000;
        font-size: 14px;
        animation: fadeOut 2s ease forwards;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}


function displayDrivers(drivers, favorites = []) {
    if (!container) return;
    
    if (!drivers || drivers.length === 0) {
        container.innerHTML = '<div class="no-results">🔍 No drivers found matching your criteria</div>';
        return;
    }
    
    const driversHTML = drivers.map(driver => {
        const isFav = favorites.includes(driver.name);
        const teamColor = driver.team_color || '#e10600';
        
        return `
            <div class="driver-card" data-driver-id="${driver.id}">
                <img src="${driver.image}" alt="${driver.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=F1+Driver'">
                <div class="info">
                    <h2>${driver.name}</h2>
                    <p>🏎️ Team: ${driver.team}</p>
                    <p>🔢 Number: #${driver.number}</p>
                    ${driver.points ? `<p>⭐ Points: ${driver.points}</p>` : ''}
                    <p class="stats">🏆 ${driver.championships || 0} Titles | ${driver.wins || 0} Wins | 🥉 ${driver.podiums || 0} Podiums</p>
                    <div class="button-group">
                        <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-driver="${driver.name}">
                            ${isFav ? '★' : '☆'} Favorite
                        </button>
                        <button class="details-btn" data-driver='${JSON.stringify(driver)}'>
                            📋 View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = driversHTML;
    

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const driverName = btn.dataset.driver;
            const added = addFavorite(driverName);
            if (added) {
                btn.classList.add('favorited');
                btn.innerHTML = '★ Favorite';
                showToast('⭐ Added to favorites!');
            } else {
                showToast('Already in favorites!', '#ffd700');
            }
        });
    });
    

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const driver = JSON.parse(btn.dataset.driver);
            showDriverDetails(driver);
        });
    });
}


function showDriverDetails(driver) {
    if (!driverModalManager) return;
    
    const modalContent = `
        <div class="driver-detail">
            <h2>${driver.name}</h2>
            <img src="${driver.image}" alt="${driver.name}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=F1'">
            <div class="detail-stats">
                <p><strong>🏎️ Team:</strong> ${driver.team}</p>
                <p><strong>🔢 Driver Number:</strong> #${driver.number}</p>
                <p><strong>🌍 Nationality:</strong> ${driver.nationality}</p>
                <p><strong>🎂 Age:</strong> ${driver.age}</p>
                <p><strong>🏆 Championships:</strong> ${driver.championships || 0}</p>
                <p><strong>🏁 Race Wins:</strong> ${driver.wins || 0}</p>
                <p><strong>🥉 Podiums:</strong> ${driver.podiums || 0}</p>
                ${driver.points ? `<p><strong>⭐ Points:</strong> ${driver.points}</p>` : ''}
            </div>
        </div>
    `;
    driverModalManager.open(modalContent);
}


function populateTeamFilter(drivers) {
    if (!teamFilter) return;
    
    const uniqueTeams = [...new Set(drivers.map(driver => driver.team))];
    
    while (teamFilter.options.length > 1) {
        teamFilter.remove(1);
    }
    
    uniqueTeams.sort().forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
    
    console.log(`Added ${uniqueTeams.length} teams to filter`);
}


function applyFilters() {
    const searchValue = searchInput?.value.toLowerCase() || '';
    const selectedTeam = teamFilter?.value || 'all';
    
    let filtered = [...allDrivers];
    
    if (selectedTeam !== 'all') {
        filtered = filtered.filter(driver => driver.team === selectedTeam);
    }
    
    if (searchValue) {
        filtered = filtered.filter(driver => 
            driver.name.toLowerCase().includes(searchValue) ||
            driver.nationality.toLowerCase().includes(searchValue)
        );
    }
    
    const favorites = getFromLocalStorage(STORAGE_KEYS.FAVORITE_DRIVERS) || [];
    displayDrivers(filtered, favorites);
}


async function loadDrivers() {
    if (!container) return;
    
    container.innerHTML = '<div class="loading-spinner">🏎️ Loading drivers from API...</div>';
    
    try {

        const { getDriverStandings } = await import('./api.js');
        
        console.log('📡 Fetching driver standings for 2024...');
        const data = await getDriverStandings(2024);
        console.log('📦 API Response:', data);
        
        if (!data) {
            container.innerHTML = '<div class="error-message">No response from API</div>';
            return;
        }
        
        if (data.error) {
            container.innerHTML = `<div class="error-message">API Error: ${data.error.join(', ')}</div>`;
            return;
        }
        
        if (!data.response || data.response.length === 0) {
            container.innerHTML = `<div class="error-message">No drivers found in standings</div>`;
            return;
        }
        
        console.log(`✅ Found ${data.response.length} drivers from API`);
        

        allDrivers = data.response.map(entry => {
            const driver = entry.driver || {};
            const team = entry.team || {};
            
            return {
                id: driver.id || entry.id,
                name: driver.name || 'Unknown Driver',
                number: driver.number || 'N/A',
                team: team.name || 'Unknown Team',
                nationality: driver.country || 'Unknown',
                age: driver.birthdate ? 
                    new Date().getFullYear() - new Date(driver.birthdate).getFullYear() : 
                    'N/A',
                championships: driver.world_championships || 0,
                wins: driver.wins || 0,
                podiums: driver.podiums || 0,
                points: entry.points || 0,
                position: entry.position || 0,
                image: driver.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(driver.name || 'Driver')}`
            };
        });
        
        console.log(`✅ Transformed ${allDrivers.length} drivers`);
        console.log('👥 First driver:', allDrivers[0]);
        
        populateTeamFilter(allDrivers);
        
        const favorites = getFromLocalStorage(STORAGE_KEYS.FAVORITE_DRIVERS) || [];
        displayDrivers(allDrivers, favorites);
        
    } catch (error) {
        console.error('❌ Error loading drivers:', error);
        container.innerHTML = `<div class="error-message">⚠️ Failed to load drivers: ${error.message}</div>`;
    }
}


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        70% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);


document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing...');
    loadDrivers();
    
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (teamFilter) teamFilter.addEventListener('change', applyFilters);
});


window.__debug = { loadDrivers, applyFilters, allDrivers };