// ============ CONFIGURATION ============
export const STORAGE_KEYS = {
    FAVORITE_TEAMS: 'favoriteTeams',
    FAVORITE_DRIVERS: 'favoriteDrivers',
    USER_PREFERENCES: 'userPreferences'
};

// ============ API FUNCTIONS ============
export async function fetchF1Data() {
    try {
        // Path goes UP one level (out of scripts folder) then INTO data folder
        const response = await fetch('../data/f1-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data loaded successfully:', data.drivers?.length, 'drivers');
        return data;
    } catch (error) {
        console.error('Error fetching F1 data:', error);
        return { drivers: [], teams: [] };
    }
}

// ============ LOCAL STORAGE FUNCTIONS ============
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Saved to localStorage: ${key}`);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

export function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

export function addFavorite(type, itemName) {
    const key = type === 'driver' ? STORAGE_KEYS.FAVORITE_DRIVERS : STORAGE_KEYS.FAVORITE_TEAMS;
    let favorites = getFromLocalStorage(key) || [];
    
    if (!favorites.includes(itemName)) {
        favorites.push(itemName);
        saveToLocalStorage(key, favorites);
        console.log(`Added ${itemName} to ${type} favorites`);
        return true;
    }
    console.log(`${itemName} already in favorites`);
    return false;
}

// ============ MODAL FUNCTIONS ============
export class ModalManager {
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