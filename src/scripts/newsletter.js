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

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'newsletter.html';
    const navLinks = document.querySelectorAll('.navigation a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            console.log('Active nav link set to:', href);
        }
    });
}

const form = document.getElementById('newsletterForm');
if (form) {
    form.addEventListener('submit', function(e) {
        const subscriptionData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            preference: document.getElementById('preference')?.value || '',
            source: document.querySelector('input[name="source"]:checked')?.value || 'Not specified',
            message: document.getElementById('message')?.value || '',
            date: new Date().toISOString()
        };
        localStorage.setItem('lastSubscription', JSON.stringify(subscriptionData));
        console.log('Subscription saved:', subscriptionData);
    });
}

function init() {
    console.log('Initializing newsletter page...');
    setActiveNavLink();
    console.log('Newsletter page initialization complete');
}

document.addEventListener('DOMContentLoaded', init);