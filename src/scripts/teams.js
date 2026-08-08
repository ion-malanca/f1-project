const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

let allTeams = [];

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

async function loadTeams() {
    const container = document.getElementById('teams-container');
    if (!container) {
        console.error('Teams container not found!');
        return;
    }
    
    container.innerHTML = '<div class="loading-spinner">🏭 Loading teams...</div>';
    
    try {
        const response = await fetch('./data/f1-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allTeams = data.teams || [];
        
        console.log(`Loaded ${allTeams.length} teams from JSON`);
        
        if (allTeams.length === 0) {
            container.innerHTML = '<div class="error-message">No teams found in JSON file</div>';
            return;
        }

        populateEngineFilter(allTeams);

        displayTeams(allTeams);
        
    } catch (error) {
        console.error('Error loading teams:', error);
        container.innerHTML = `
            <div class="error-message">
                ⚠️ Unable to load teams<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function populateEngineFilter(teams) {
    const engineFilter = document.getElementById('engineFilter');
    if (!engineFilter) return;

    const uniqueEngines = [...new Set(teams.map(team => team.engine))];

    uniqueEngines.sort();

    uniqueEngines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine;
        option.textContent = engine;
        engineFilter.appendChild(option);
    });
    
    console.log(`Added ${uniqueEngines.length} engines to filter`);
}

function displayTeams(teams) {
    const container = document.getElementById('teams-container');
    
    if (!teams || teams.length === 0) {
        container.innerHTML = '<div class="no-results">🔍 No teams found matching your criteria</div>';
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favoriteTeams')) || [];

    const teamsHTML = teams.map(team => {
        const isFav = favorites.includes(team.name);
        const driversList = team.drivers.join(', ');
        
        return `
            <div class="team-card" data-team-id="${team.name}">
                <img src="${team.image}" alt="${team.name} car" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=F1+Team'">
                <div class="info">
                    <h2>${team.name}</h2>
                    <p>🏭 Engine: ${team.engine}</p>
                    <p>📍 Base: ${team.base}</p>
                    <p>📅 Founded: ${team.founded}</p>
                    <p class="stats">🏆 ${team.championships} Championships | 🏁 ${team.wins} Wins</p>
                    <p class="drivers-list">👥 Drivers: ${driversList}</p>
                    <div class="button-group">
                        <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-team="${team.name}">
                            ${isFav ? '★' : '☆'} Favorite
                        </button>
                        <button class="details-btn" data-team='${JSON.stringify(team)}'>
                            📋 View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = teamsHTML;
    console.log(`Displayed ${teams.length} teams`);
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const teamName = btn.dataset.team;
            addToFavorites(teamName, btn);
        });
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const team = JSON.parse(btn.dataset.team);
            showTeamDetails(team);
        });
    });
}

function addToFavorites(teamName, button) {
    let favorites = JSON.parse(localStorage.getItem('favoriteTeams')) || [];
    
    if (!favorites.includes(teamName)) {
        favorites.push(teamName);
        localStorage.setItem('favoriteTeams', JSON.stringify(favorites));
        button.innerHTML = '★ Favorited';
        button.classList.add('favorited');
        showToast(`⭐ ${teamName} added to favorites!`);
        console.log(`Added ${teamName} to favorites`);
    } else {
        showToast(`${teamName} is already in favorites!`, '#ffd700');
    }
}

function showTeamDetails(team) {
    const modal = document.getElementById('teamModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    const driversList = team.drivers.map(driver => `<li>🏎️ ${driver}</li>`).join('');
    
    modalContent.innerHTML = `
        <div class="team-detail">
            <h2>${team.name}</h2>
            <img src="${team.image}" alt="${team.name} car" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=F1'">
            <div class="detail-stats">
                <p><strong>🏭 Engine:</strong> ${team.engine}</p>
                <p><strong>📍 Base:</strong> ${team.base}</p>
                <p><strong>📅 Founded:</strong> ${team.founded}</p>
                <p><strong>🏆 Constructor Championships:</strong> ${team.championships}</p>
                <p><strong>🏁 Race Wins:</strong> ${team.wins}</p>
                <p><strong>👥 Drivers:</strong></p>
                <ul>${driversList}</ul>
            </div>
        </div>
    `;
    
    modal.showModal();

    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.close();
    }

    modal.onclick = (e) => {
        if (e.target === modal) modal.close();
    };
}

function applyFilters() {
    const searchValue = document.getElementById('search')?.value.toLowerCase() || '';
    const selectedEngine = document.getElementById('engineFilter')?.value || 'all';

    let filtered = [...allTeams];
    
    if (selectedEngine !== 'all') {
        filtered = filtered.filter(team => team.engine === selectedEngine);
    }
    
    if (searchValue) {
        filtered = filtered.filter(team => 
            team.name.toLowerCase().includes(searchValue) ||
            team.base.toLowerCase().includes(searchValue) ||
            team.engine.toLowerCase().includes(searchValue)
        );
    }
    
    displayTeams(filtered);
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

function setupModals() {
    const attributionLink = document.getElementById('attributionLink');
    const attributionModal = document.getElementById('attributionModal');
    
    if (attributionLink && attributionModal) {
        attributionLink.addEventListener('click', (e) => {
            e.preventDefault();
            attributionModal.showModal();
        });
        
        const closeAttrBtn = attributionModal.querySelector('.close-modal');
        if (closeAttrBtn) {
            closeAttrBtn.onclick = () => attributionModal.close();
        }
        attributionModal.onclick = (e) => {
            if (e.target === attributionModal) attributionModal.close();
        };
    }
}

const searchInput = document.getElementById('search');
const engineFilter = document.getElementById('engineFilter');

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}
if (engineFilter) {
    engineFilter.addEventListener('change', applyFilters);
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

function init() {
    setupModals();
    loadTeams();
}

document.addEventListener('DOMContentLoaded', init);