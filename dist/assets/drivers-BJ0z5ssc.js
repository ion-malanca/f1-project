import"./modulepreload-polyfill-P2Xu9kJm.js";var e={FAVORITE_DRIVERS:`favoriteDrivers`,USER_PREFERENCES:`userPreferences`},t=[],n=document.getElementById(`currentYear`);n&&(n.textContent=new Date().getFullYear());var r=document.getElementById(`hamburger`),i=document.getElementById(`nav-menu`);r&&i&&(r.addEventListener(`click`,()=>{i.classList.toggle(`active`),r.textContent=i.classList.contains(`active`)?`✕`:`☰`}),i.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{i.classList.remove(`active`),r.textContent=`☰`})}));async function a(){try{console.log(`Fetching data from ../data/f1-data.json`);let e=await fetch(`./data/f1-data.json`);if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();return console.log(`Data loaded:`,t.drivers?.length,`drivers`),t}catch(e){return console.error(`Error fetching data:`,e),{drivers:[],teams:[]}}}function o(e){try{let t=localStorage.getItem(e);return t?JSON.parse(t):null}catch(e){return console.error(`Error reading from localStorage:`,e),null}}function s(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(e){return console.error(`Error saving to localStorage:`,e),!1}}function c(t){let n=o(e.FAVORITE_DRIVERS)||[];return n.includes(t)?(console.log(`${t} already in favorites`),!1):(n.push(t),s(e.FAVORITE_DRIVERS,n),console.log(`Added ${t} to favorites`),!0)}var l=class{constructor(e){this.modal=e,this.setupEventListeners()}setupEventListeners(){let e=this.modal?.querySelector(`.close-modal`);e&&e.addEventListener(`click`,()=>this.close()),this.modal?.addEventListener(`click`,e=>{e.target===this.modal&&this.close()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.modal?.open&&this.close()})}open(e){let t=this.modal?.querySelector(`#modalContent`);t&&e&&(t.innerHTML=e),this.modal?.showModal(),document.body.style.overflow=`hidden`}close(){this.modal?.close(),document.body.style.overflow=``}},u=document.getElementById(`driverModal`),d=null;u&&(d=new l(u));function f(e){let t=document.getElementById(`teamFilter`);if(!t)return;let n=[...new Set(e.map(e=>e.team))];for(;t.options.length>1;)t.remove(1);n.sort().forEach(e=>{let n=document.createElement(`option`);n.value=e,n.textContent=e,t.appendChild(n)}),console.log(`Added ${n.length} teams to filter`)}function p(e,t=[]){let n=document.getElementById(`drivers-container`);if(!e||e.length===0){n.innerHTML=`<div class="no-results">🔍 No drivers found matching your criteria</div>`;return}n.innerHTML=e.map(e=>{let n=t.includes(e.name);return`
            <div class="driver-card" data-driver-id="${e.id}">
                <img src="${e.image}" alt="${e.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=F1+Driver'">
                <div class="info">
                    <h2>${e.name}</h2>
                    <p>🏎️ Team: ${e.team}</p>
                    <p>🔢 Number: #${e.number}</p>
                    <p>🌍 Nationality: ${e.nationality}</p>
                    <p>🎂 Age: ${e.age}</p>
                    <p class="stats">🏆 ${e.championships} Titles | ${e.wins} Wins | 🥉 ${e.podiums} Podiums</p>
                    <div class="button-group">
                        <button class="favorite-btn ${n?`favorited`:``}" data-driver="${e.name}">
                            ${n?`★`:`☆`} Favorite
                        </button>
                        <button class="details-btn" data-driver='${JSON.stringify(e)}'>
                            📋 View Details
                        </button>
                    </div>
                </div>
            </div>
        `}).join(``),document.querySelectorAll(`.favorite-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.driver;c(n)?(e.classList.add(`favorited`),e.innerHTML=`★ Favorite`,g(`⭐ Added to favorites!`)):g(`Already in favorites!`,`#ffd700`)})}),document.querySelectorAll(`.details-btn`).forEach(e=>{e.addEventListener(`click`,()=>{m(JSON.parse(e.dataset.driver))})})}function m(e){if(!d)return;let t=`
        <div class="driver-detail">
            <h2>${e.name}</h2>
            <img src="${e.image}" alt="${e.name}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=F1'">
            <div class="detail-stats">
                <p><strong>🏎️ Team:</strong> ${e.team}</p>
                <p><strong>🔢 Driver Number:</strong> #${e.number}</p>
                <p><strong>🌍 Nationality:</strong> ${e.nationality}</p>
                <p><strong>🎂 Age:</strong> ${e.age}</p>
                <p><strong>🏆 Championships:</strong> ${e.championships}</p>
                <p><strong>🏁 Race Wins:</strong> ${e.wins}</p>
                <p><strong>🥉 Podiums:</strong> ${e.podiums}</p>
            </div>
        </div>
    `;d.open(t)}function h(){let n=document.getElementById(`search`)?.value.toLowerCase()||``,r=document.getElementById(`teamFilter`)?.value||`all`,i=[...t];r!==`all`&&(i=i.filter(e=>e.team===r)),n&&(i=i.filter(e=>e.name.toLowerCase().includes(n)||e.nationality.toLowerCase().includes(n)));let a=o(e.FAVORITE_DRIVERS)||[];p(i,a)}function g(e,t=`#00ff00`){let n=document.createElement(`div`);n.textContent=e,n.style.cssText=`
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${t===`#00ff00`?`rgba(0,100,0,0.9)`:`rgba(100,100,0,0.9)`};
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        z-index: 2000;
        font-size: 14px;
        animation: fadeOut 2s ease forwards;
    `,document.body.appendChild(n),setTimeout(()=>n.remove(),2e3)}async function _(){let n=document.getElementById(`drivers-container`);if(n){n.innerHTML=`<div class="loading-spinner">🏎️ Loading drivers...</div>`;try{if(t=(await a()).drivers||[],console.log(`Loaded ${t.length} drivers`),t.length===0){n.innerHTML=`<div class="error-message">No driver data found. Please check data/f1-data.json file.</div>`;return}f(t);let r=o(e.FAVORITE_DRIVERS)||[];p(t,r)}catch(e){console.error(`Error:`,e),n.innerHTML=`<div class="error-message">⚠️ Unable to load drivers. Make sure data/f1-data.json exists.</div>`}}}var v=document.createElement(`style`);v.textContent=`
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        70% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`,document.head.appendChild(v),document.addEventListener(`DOMContentLoaded`,()=>{console.log(`DOM loaded, initializing...`),_();let e=document.getElementById(`search`),t=document.getElementById(`teamFilter`);e&&e.addEventListener(`input`,h),t&&t.addEventListener(`change`,h)});