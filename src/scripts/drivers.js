const STORAGE_KEYS = {
    FAVORITE_DRIVERS: 'favoriteDrivers',
    USER_PREFERENCES: 'userPreferences'
};

let allDrivers = [];

const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });
}

async function fetchF1Data() {
    try {
        console.log('Fetching data from ../data/f1-data.json');
        const response = await fetch('./data/f1-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data loaded:', data.drivers?.length, 'drivers');
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { drivers: [], teams: [] };
    }
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
        console.log(`Added ${driverName} to favorites`);
        return true;
    }
    console.log(`${driverName} already in favorites`);
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

const driverModal = document.getElementById('driverModal');
let driverModalManager = null;
if (driverModal) {
    driverModalManager = new ModalManager(driverModal);
}

function populateTeamFilter(drivers) {
    const teamFilter = document.getElementById('teamFilter');
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

function displayDrivers(drivers, favorites = []) {
    const container = document.getElementById('drivers-container');
    
    if (!drivers || drivers.length === 0) {
        container.innerHTML = '<div class="no-results">🔍 No drivers found matching your criteria</div>';
        return;
    }
    
    const driversHTML = drivers.map(driver => {
        const isFav = favorites.includes(driver.name);
        
        return `
            <div class="driver-card" data-driver-id="${driver.id}">
                <img src="${driver.image}" alt="${driver.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=F1+Driver'">
                <div class="info">
                    <h2>${driver.name}</h2>
                    <p>🏎️ Team: ${driver.team}</p>
                    <p>🔢 Number: #${driver.number}</p>
                    <p>🌍 Nationality: ${driver.nationality}</p>
                    <p>🎂 Age: ${driver.age}</p>
                    <p class="stats">🏆 ${driver.championships} Titles | ${driver.wins} Wins | 🥉 ${driver.podiums} Podiums</p>
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
                <p><strong>🏆 Championships:</strong> ${driver.championships}</p>
                <p><strong>🏁 Race Wins:</strong> ${driver.wins}</p>
                <p><strong>🥉 Podiums:</strong> ${driver.podiums}</p>
            </div>
        </div>
    `;
    
    driverModalManager.open(modalContent);
}

function applyFilters() {
    const searchValue = document.getElementById('search')?.value.toLowerCase() || '';
    const selectedTeam = document.getElementById('teamFilter')?.value || 'all';
    
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

async function loadDrivers() {
    const container = document.getElementById('drivers-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-spinner">🏎️ Loading drivers...</div>';
    
    try {
        const data = await fetchF1Data();
        allDrivers = data.drivers || [];
        
        console.log(`Loaded ${allDrivers.length} drivers`);
        
        if (allDrivers.length === 0) {
            container.innerHTML = '<div class="error-message">No driver data found. Please check data/f1-data.json file.</div>';
            return;
        }
        
        populateTeamFilter(allDrivers);
        const favorites = getFromLocalStorage(STORAGE_KEYS.FAVORITE_DRIVERS) || [];
        displayDrivers(allDrivers, favorites);
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="error-message">⚠️ Unable to load drivers. Make sure data/f1-data.json exists.</div>';
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
    console.log('DOM loaded, initializing...');
    loadDrivers();

    const searchInput = document.getElementById('search');
    const teamFilter = document.getElementById('teamFilter');
    
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (teamFilter) teamFilter.addEventListener('change', applyFilters);
});