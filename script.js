// ---- Gestion bouton "Voir tous les amis" ----
document.addEventListener('DOMContentLoaded', function() {
    // Affichage des amis
    const btnShowFriends = document.getElementById('show-all-friends');
    const containerFriends = document.getElementById('friends-container');
    if (btnShowFriends && containerFriends) {
        btnShowFriends.onclick = function() {
            containerFriends.classList.remove('hidden-friends');
            btnShowFriends.disabled = true;
            btnShowFriends.innerText = "👥 Amis affichés";
        };
    }

    // ---- MUSIQUE ----
    var audio = document.getElementById('background-music');
    var volume = document.getElementById('music-volume');
    var playMusicBtn = document.getElementById('play-music');
    if(audio && volume) audio.volume = volume.value;
    if(playMusicBtn && audio && volume) {
        playMusicBtn.onclick = function() {
            audio.volume = volume.value;
            audio.play();
            playMusicBtn.style.display = 'none';
        };
    }
    if(volume && audio) {
        volume.addEventListener('input', function() {
            audio.volume = this.value;
        });
    }

    // ---- CLIC SUR LES CARTES ----
    document.querySelectorAll('.friend-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (modeComparison && selectedForCompare && card !== selectedForCompare) {
                card.classList.add('selected');
                showComparison(selectedForCompare, card);
                return;
            }
            if (card.classList.contains('selected')) {
                resetPopupState();
                return;
            }
            showProfile(card);
        });
    });

    // ---- CLASSEMENT POPUP ----
    var openClassementBtn = document.getElementById('open-classement');
    var wheelPopup = document.getElementById('wheel-popup');
    var closeWheelBtn = document.getElementById('close-wheel');
    var resultDiv = document.getElementById('classement-resultat');
    if(openClassementBtn && wheelPopup && closeWheelBtn) {
        openClassementBtn.onclick = function() {
            wheelPopup.style.display = 'flex';
            resultDiv.innerHTML = "";
        };
        closeWheelBtn.onclick = function() {
            wheelPopup.style.display = 'none';
        };
    }

    // ---- Boutons de jeux classement ----
    const JEUX_POSSIBLES = [
        "Fortnite", "Minecraft", "Rocket League",
        "League of Legends", "Valorant", "CS:GO", "World of Warcraft"
    ];
    const btnsContainer = document.getElementById('classement-jeux-btns');
    if (btnsContainer) {
        btnsContainer.innerHTML = '';
        JEUX_POSSIBLES.forEach(j => {
            const btn = document.createElement('button');
            btn.className = 'jeu-btn';
            btn.setAttribute('data-jeu', j);
            btn.innerText = j;
            btn.onclick = function() {
                showClassement(j);
            };
            btnsContainer.appendChild(btn);
        });
    }
});

// ---- Variables globales ----
let selectedForCompare = null;
let modeComparison = false;

// ---- Fonctions popups ----
function resetPopupState() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('popup').style.display = 'none';
    document.querySelectorAll('.friend-card.selected').forEach(c => c.classList.remove('selected'));
    selectedForCompare = null;
    modeComparison = false;
}

function setPopupCloseEvents() {
    document.getElementById('close').onclick = function() {
        resetPopupState();
    };
    document.getElementById('popup').onclick = function(e) {
        if (e.target === this) {
            resetPopupState();
        }
    };
}

function getSkillsForDisplay(card) {
    const originalSkills = JSON.parse(card.dataset.skills);
    return originalSkills;
}

// ---- Affichage profil ----
function showProfile(card) {
    resetPopupState();
    card.classList.add('selected');
    const clone = card.cloneNode(true);
    clone.classList.add('popup-card');
    clone.classList.remove('animated');
    clone.onclick = null;
    let editBtn = clone.querySelector('.edit-btn');
    if (editBtn) editBtn.style.display = "none";
    const skills = getSkillsForDisplay(card);
    let skillsHtml = '<div class="skills-block">';
    skills.forEach(skill => {
        skillsHtml += `<div class="skill-line">
            <span class="skill-cat">${skill.cat}</span>
            <span class="skill-bar">
                <span style="color:#ffcc4d;font-size:1.2em;">
                    ${"★".repeat(skill.val)}
                </span>
                <span style="color:#7289da;font-size:1.2em;">
                    ${"☆".repeat(5 - skill.val)}
                </span>
            </span>
        </div>`;
    });
    skillsHtml += '</div>';
    let descElem = clone.querySelector('.pseudo');
    if (descElem) {
        descElem.insertAdjacentHTML('afterend',
            `<div class="popup-desc">${card.dataset.desc}</div>${skillsHtml}`
        );
    }
    let compareBtn = document.createElement('button');
    compareBtn.id = "compare-btn";
    compareBtn.innerText = "Comparaison";
    compareBtn.style.marginTop = "18px";
    compareBtn.style.background = "#ffcc4d";
    compareBtn.style.color = "#23272a";
    compareBtn.style.fontWeight = "bold";
    compareBtn.style.border = "none";
    compareBtn.style.padding = "10px 25px";
    compareBtn.style.borderRadius = "12px";
    compareBtn.style.fontSize = "1.09em";
    compareBtn.style.cursor = "pointer";
    compareBtn.style.boxShadow = "0 2px 10px #0004";
    compareBtn.style.transition = "background 0.18s";
    compareBtn.onclick = function(e) {
        e.stopPropagation();
        document.getElementById('popup').classList.add('hidden');
        document.getElementById('popup').style.display = 'none';
        card.classList.add('selected');
        selectedForCompare = card;
        modeComparison = true;
        showHint("Sélectionne un ami à comparer !");
    };
    clone.appendChild(compareBtn);
    let popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = `
        <span id="close" style="position:absolute;top:18px;right:24px;font-size:2em;color:#fff;cursor:pointer;">&times;</span>
    `;
    popupContent.appendChild(clone);
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').style.display = 'flex';
    setPopupCloseEvents();
}

function showHint(msg) {
    let hint = document.getElementById('compare-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'compare-hint';
        hint.style.position = 'fixed';
        hint.style.top = '30px';
        hint.style.right = '30px';
        hint.style.background = '#ffcc4d';
        hint.style.color = '#23272a';
        hint.style.padding = '14px 28px';
        hint.style.borderRadius = '12px';
        hint.style.fontSize = '1.13em';
        hint.style.boxShadow = '0 4px 16px #0006';
        hint.style.zIndex = 1002;
        document.body.appendChild(hint);
    }
    hint.textContent = msg;
    hint.style.display = 'block';
    clearTimeout(hint.timeout);
    hint.timeout = setTimeout(() => { hint.style.display = 'none'; }, 3500);
}

// ---- Affichage comparaison ----
function showComparison(cardA, cardB) {
    const cloneA = cardA.cloneNode(true);
    const cloneB = cardB.cloneNode(true);
    [cloneA, cloneB].forEach((clone, idx) => {
        clone.classList.add('popup-card');
        clone.classList.remove('animated');
        clone.onclick = null;
        let editBtn = clone.querySelector('.edit-btn');
        if (editBtn) editBtn.style.display = "none";
        const skills = getSkillsForDisplay(idx === 0 ? cardA : cardB);
        let skillsHtml = '<div class="skills-block">';
        skills.forEach(skill => {
            skillsHtml += `<div class="skill-line">
                <span class="skill-cat">${skill.cat}</span>
                <span class="skill-bar">
                    <span style="color:#ffcc4d;font-size:1.2em;">
                        ${"★".repeat(skill.val)}
                    </span>
                    <span style="color:#7289da;font-size:1.2em;">
                        ${"☆".repeat(5 - skill.val)}
                    </span>
                </span>
            </div>`;
        });
        skillsHtml += '</div>';
        let descElem = clone.querySelector('.pseudo');
        if (descElem) {
            descElem.insertAdjacentHTML('afterend',
                `<div class="popup-desc">${(idx === 0 ? cardA : cardB).dataset.desc}</div>${skillsHtml}`
            );
        }
    });
    let popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = `
        <span id="close" style="position:absolute;top:18px;right:24px;font-size:2em;color:#fff;cursor:pointer;">&times;</span>
        <div style="display:flex;gap:28px;justify-content:center;align-items:center;">
            ${cloneA.outerHTML}
            <div style="font-size:2.4em;color:#ffcc4d;font-weight:bold;align-self:center;margin:0 8px;">VS</div>
            ${cloneB.outerHTML}
        </div>
    `;
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').style.display = 'flex';
    setPopupCloseEvents();
}

// ---- Affichage classement par jeu ----

// ==== PARAMS AIRTABLE ====
const AIRTABLE_BASE_ID = 'app69effbgQ64DeTE';
const AIRTABLE_TOKEN = 'patBGRMEBkf7MNJAr.ea994efe41358abdfcd5f8fc8816387a05aacbb822a53a618d4bbb36d72ccb57';
const TABLE = 'Imported%20table';

// ==== Fonctions utiles ====
function etoilesToInt(str) {
    if (!str) return 0;
    const n = parseInt(str);
    return isNaN(n) ? 0 : n;
}
async function fetchNotesJason() {
    const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE}?pageSize=100`,
        {
            headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
        }
    );
    const data = await res.json();
    return data.records.map(r => r.fields);
}
function calculMoyenne(notesArray, champ) {
    const valeurs = notesArray.map(row => etoilesToInt(row[champ])).filter(x => x > 0);
    if (valeurs.length === 0) return 0;
    return valeurs.reduce((a, b) => a + b, 0) / valeurs.length;
}

// ==== Affichage classement basé sur la moyenne des notes ====
async function showClassement(jeu) {
    const fieldNames = {
        "Fortnite": "note Jason [Fortnite]",
        "Minecraft": "note Jason [Minecraft]",
        "Rocket League": "note Jason [Rocket League]",
        "League of Legends": "note Jason [League of Legends]"
    };
    const data = await fetchNotesJason();
    // Ici, pour l'exemple, on ne prend que "Jason", mais tu peux boucler sur tous les amis si tu ajoutes d'autres colonnes
    const champ = fieldNames[jeu];
    const moyenne = calculMoyenne(data, champ);
    const etoiles = "★".repeat(Math.round(moyenne)) + "☆".repeat(5 - Math.round(moyenne));
    document.getElementById('classement-resultat').innerHTML = `
        <div style="font-size:2em;font-weight:bold;margin-bottom:18px;">${jeu}</div>
        <div style="font-size:1.5em;">Moyenne : ${moyenne.toFixed(2)} / 5</div>
        <div style="font-size:2.5em;color:#ffcc4d;margin-bottom:18px;">${etoiles}</div>
    `;
}
// --- le reste de script.js (affichage, popup, etc.) reste inchangé ---

// (Assure-toi que showClassement(jeu) est bien appelé lors du clic sur le bouton de jeu !)
