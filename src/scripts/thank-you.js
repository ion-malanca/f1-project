const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
    console.log('Year set to:', new Date().getFullYear());
}

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        console.log('Menu toggled');
    });
    
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });
}

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
const email = urlParams.get('email');
const preference = urlParams.get('preference');
const source = urlParams.get('source');
const message = urlParams.get('message');

const displayDiv = document.getElementById('formDataDisplay');
let savedData = localStorage.getItem('lastSubscription');
if (savedData && !name) {
    savedData = JSON.parse(savedData);
}

if (name && email) {
    let preferenceText = '';
    switch(preference) {
        case 'drivers': preferenceText = '🏎️ Driver News & Interviews'; break;
        case 'teams': preferenceText = '🏭 Team Updates & Constructors'; break;
        case 'races': preferenceText = '🏁 Race Previews & Results'; break;
        case 'all': preferenceText = '📰 All F1 Content'; break;
        default: preferenceText = preference || 'All Content';
    }
    
    let sourceText = '';
    switch(source) {
        case 'social': sourceText = '📱 Social Media'; break;
        case 'friend': sourceText = '👥 Friend/Family'; break;
        case 'search': sourceText = '🔍 Search Engine'; break;
        default: sourceText = source || 'Not specified';
    }
    
    displayDiv.innerHTML = `
        <div class="submission-data">
            <p><strong>👤 Name:</strong> ${decodeURIComponent(name)}</p>
            <p><strong>📧 Email:</strong> ${decodeURIComponent(email)}</p>
            <p><strong>📬 Content Preference:</strong> ${preferenceText}</p>
            <p><strong>📢 How you found us:</strong> ${sourceText}</p>
            ${message ? `<p><strong>💬 Message:</strong> ${decodeURIComponent(message)}</p>` : ''}
        </div>
    `;
} else if (savedData) {
    let preferenceText = '';
    switch(savedData.preference) {
        case 'drivers': preferenceText = '🏎️ Driver News & Interviews'; break;
        case 'teams': preferenceText = '🏭 Team Updates & Constructors'; break;
        case 'races': preferenceText = '🏁 Race Previews & Results'; break;
        case 'all': preferenceText = '📰 All F1 Content'; break;
        default: preferenceText = savedData.preference || 'All Content';
    }
    
    displayDiv.innerHTML = `
        <div class="submission-data">
            <p><strong>👤 Name:</strong> ${savedData.name}</p>
            <p><strong>📧 Email:</strong> ${savedData.email}</p>
            <p><strong>📬 Content Preference:</strong> ${preferenceText}</p>
            <p><strong>📢 How you found us:</strong> ${savedData.source}</p>
            ${savedData.message ? `<p><strong>💬 Message:</strong> ${savedData.message}</p>` : ''}
        </div>
    `;
} else {
    displayDiv.innerHTML = `
        <div class="submission-data">
            <p>No subscription data found.</p>
            <p>Please <a href="newsletter.html" style="color:#00ffff;">subscribe here</a> to join our newsletter.</p>
        </div>
    `;
}

function init() {
    console.log('Initializing thank-you page...');
    console.log('Form data displayed');
}

document.addEventListener('DOMContentLoaded', init);