import"./modulepreload-polyfill-P2Xu9kJm.js";var e=document.getElementById(`currentYear`);e&&(e.textContent=new Date().getFullYear());var t=[],n=document.getElementById(`hamburger`),r=document.getElementById(`nav-menu`);n&&r&&(n.addEventListener(`click`,()=>{r.classList.toggle(`active`),n.textContent=r.classList.contains(`active`)?`✕`:`☰`}),r.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{r.classList.remove(`active`),n.textContent=`☰`})}));async function i(){let e=document.getElementById(`teams-container`);if(!e){console.error(`Teams container not found!`);return}e.innerHTML=`<div class="loading-spinner">🏭 Loading teams...</div>`;try{let n=await fetch(`./data/f1-data.json`);if(!n.ok)throw Error(`HTTP error! status: ${n.status}`);if(t=(await n.json()).teams||[],console.log(`Loaded ${t.length} teams from JSON`),t.length===0){e.innerHTML=`<div class="error-message">No teams found in JSON file</div>`;return}a(t),o(t)}catch(t){console.error(`Error loading teams:`,t),e.innerHTML=`
            <div class="error-message">
                ⚠️ Unable to load teams<br>
                <small>${t.message}</small>
            </div>
        `}}function a(e){let t=document.getElementById(`engineFilter`);if(!t)return;let n=[...new Set(e.map(e=>e.engine))];n.sort(),n.forEach(e=>{let n=document.createElement(`option`);n.value=e,n.textContent=e,t.appendChild(n)}),console.log(`Added ${n.length} engines to filter`)}function o(e){let t=document.getElementById(`teams-container`);if(!e||e.length===0){t.innerHTML=`<div class="no-results">🔍 No teams found matching your criteria</div>`;return}let n=JSON.parse(localStorage.getItem(`favoriteTeams`))||[];t.innerHTML=e.map(e=>{let t=n.includes(e.name),r=e.drivers.join(`, `);return`
            <div class="team-card" data-team-id="${e.name}">
                <img src="${e.image}" alt="${e.name} car" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=F1+Team'">
                <div class="info">
                    <h2>${e.name}</h2>
                    <p>🏭 Engine: ${e.engine}</p>
                    <p>📍 Base: ${e.base}</p>
                    <p>📅 Founded: ${e.founded}</p>
                    <p class="stats">🏆 ${e.championships} Championships | 🏁 ${e.wins} Wins</p>
                    <p class="drivers-list">👥 Drivers: ${r}</p>
                    <div class="button-group">
                        <button class="favorite-btn ${t?`favorited`:``}" data-team="${e.name}">
                            ${t?`★`:`☆`} Favorite
                        </button>
                        <button class="details-btn" data-team='${JSON.stringify(e)}'>
                            📋 View Details
                        </button>
                    </div>
                </div>
            </div>
        `}).join(``),console.log(`Displayed ${e.length} teams`),document.querySelectorAll(`.favorite-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.team;s(n,e)})}),document.querySelectorAll(`.details-btn`).forEach(e=>{e.addEventListener(`click`,()=>{c(JSON.parse(e.dataset.team))})})}function s(e,t){let n=JSON.parse(localStorage.getItem(`favoriteTeams`))||[];n.includes(e)?u(`${e} is already in favorites!`,`#ffd700`):(n.push(e),localStorage.setItem(`favoriteTeams`,JSON.stringify(n)),t.innerHTML=`★ Favorited`,t.classList.add(`favorited`),u(`⭐ ${e} added to favorites!`),console.log(`Added ${e} to favorites`))}function c(e){let t=document.getElementById(`teamModal`),n=document.getElementById(`modalContent`);if(!t||!n)return;let r=e.drivers.map(e=>`<li>🏎️ ${e}</li>`).join(``);n.innerHTML=`
        <div class="team-detail">
            <h2>${e.name}</h2>
            <img src="${e.image}" alt="${e.name} car" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=F1'">
            <div class="detail-stats">
                <p><strong>🏭 Engine:</strong> ${e.engine}</p>
                <p><strong>📍 Base:</strong> ${e.base}</p>
                <p><strong>📅 Founded:</strong> ${e.founded}</p>
                <p><strong>🏆 Constructor Championships:</strong> ${e.championships}</p>
                <p><strong>🏁 Race Wins:</strong> ${e.wins}</p>
                <p><strong>👥 Drivers:</strong></p>
                <ul>${r}</ul>
            </div>
        </div>
    `,t.showModal();let i=t.querySelector(`.close-modal`);i&&(i.onclick=()=>t.close()),t.onclick=e=>{e.target===t&&t.close()}}function l(){let e=document.getElementById(`search`)?.value.toLowerCase()||``,n=document.getElementById(`engineFilter`)?.value||`all`,r=[...t];n!==`all`&&(r=r.filter(e=>e.engine===n)),e&&(r=r.filter(t=>t.name.toLowerCase().includes(e)||t.base.toLowerCase().includes(e)||t.engine.toLowerCase().includes(e))),o(r)}function u(e,t=`#00ff00`){let n=document.createElement(`div`);n.textContent=e,n.style.cssText=`
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
    `,document.body.appendChild(n),setTimeout(()=>n.remove(),2e3)}function d(){let e=document.getElementById(`attributionLink`),t=document.getElementById(`attributionModal`);if(e&&t){e.addEventListener(`click`,e=>{e.preventDefault(),t.showModal()});let n=t.querySelector(`.close-modal`);n&&(n.onclick=()=>t.close()),t.onclick=e=>{e.target===t&&t.close()}}}var f=document.getElementById(`search`),p=document.getElementById(`engineFilter`);f&&f.addEventListener(`input`,l),p&&p.addEventListener(`change`,l);var m=document.createElement(`style`);m.textContent=`
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        70% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`,document.head.appendChild(m);function h(){d(),i()}document.addEventListener(`DOMContentLoaded`,h);