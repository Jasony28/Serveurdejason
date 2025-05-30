let compareFirst = null;
let modeComparison = false;
let classementTimeouts = [];
let btns = null; // Variable globale pour les boutons de classement

const amis = [
  { pseudo: "Jason", desc: "", avatar: "", notes: { "Fortnite": 3.2, "Minecraft": 4.75, "Rocket League": 2.6, "League of Legends": 2.6, "Valorant": 3.6, "CS:GO": 3.4, "World of Warcraft": 2.5 } },
  { pseudo: "benjamin", desc: "", avatar: "", notes: { "Fortnite": 3.6, "Minecraft": 3, "Rocket League": 3.4, "League of Legends": 3, "Valorant": 3, "CS:GO": 3, "World of Warcraft": 2.8 } },
  { pseudo: "Walid", desc: "", avatar: "", notes: { "Fortnite": 3.33, "Minecraft": 3, "Rocket League": 2, "League of Legends": 2.75, "Valorant": 1.5, "CS:GO": 1.75} },
  { pseudo: "David", desc: "", avatar: "", notes: { "Fortnite": 2, "Minecraft": 2.5, "Rocket League": 5, "League of Legends": 3.4, "Valorant": 3.4, "CS:GO": 3.6, "World of Warcraft": 5 } },
  { pseudo: "Micka", desc: "", avatar: "", notes: { "Fortnite": 3, "Minecraft": 3, "Rocket League": 3, "League of Legends": 3, "Valorant": 3, "CS:GO": 3.25} },
  { pseudo: "Raphaël", desc: "", avatar: "", notes: { "Fortnite": 2.75, "Minecraft": 3.67, "Rocket League": 2.00, "League of Legends": 2.67, "Valorant": 4.67, "CS:GO": 4.00 } },
  { pseudo: "Nicolas", desc: "", avatar: "", notes: { "Fortnite": 1.5, "Rocket League": 1.75, "League of Legends": 1.75, "Valorant": 2, "CS:GO": 2 } }
];

function moyenne(obj) {
    const vals = Object.values(obj);
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}
function etoiles(n) {
    n = Math.round(n * 100) / 100;
    const entier = Math.round(n);
    return "★".repeat(entier) + "☆".repeat(5 - entier) + ` <span style="color:#aaa;font-size:0.95em;">(${n})</span>`;
}

function renderAllFriends() {
    const container = document.getElementById('friends-container');
    if (!container) return;
    container.innerHTML = '';
    amis.forEach((ami, idx) => {
        const moy = moyenne(ami.notes);
        const card = document.createElement('div');
        card.className = 'friend-card';
        card.style.cursor = "pointer";
        card.setAttribute('data-idx', idx);

        let avatarHtml = `<div class="profile-pic" style="background:#7289da;width:96px;height:96px;border-radius:50%;margin:auto;margin-bottom:14px;display:flex;align-items:center;justify-content:center;font-size:2.4em;color:#fff;">${ami.pseudo[0]}</div>`;
        card.innerHTML = `
            ${avatarHtml}
            <div class="pseudo">${ami.pseudo}</div>
            <div class="notes-moyenne" style="margin:10px 0;">
                <b>Moyenne générale :</b> ${etoiles(moy)}
            </div>
        `;
        card.onclick = () => {
            if (modeComparison && compareFirst !== null && compareFirst !== idx) {
                showComparePopup(compareFirst, idx);
                modeComparison = false;
                compareFirst = null;
            } else {
                showAmiDetail(idx);
            }
        };
        container.appendChild(card);
    });
}

let popupBg, popupContent;
function showPopup(html) {
    if (!popupBg) {
        popupBg = document.createElement('div');
        popupBg.style.position = "fixed";
        popupBg.style.top = popupBg.style.left = 0;
        popupBg.style.right = popupBg.style.bottom = 0;
        popupBg.style.zIndex = 9999;
        popupBg.style.background = "rgba(30,33,36,0.95)";
        popupBg.style.display = "flex";
        popupBg.style.justifyContent = "center";
        popupBg.style.alignItems = "center";
        document.body.appendChild(popupBg);

        popupContent = document.createElement('div');
        popupContent.style.background = "#23272a";
        popupContent.style.padding = "36px 30px 28px 30px";
        popupContent.style.borderRadius = "22px";
        popupContent.style.boxShadow = "0 8px 40px #000b";
        popupContent.style.textAlign = "center";
        popupContent.style.minWidth = "300px";
        popupContent.style.minHeight = "250px";
        popupContent.style.position = "relative";
        popupBg.appendChild(popupContent);

        popupBg.onclick = function(e) {
            if (e.target === popupBg) closePopup();
        };
    }
    popupContent.innerHTML = html;
    popupBg.style.display = "flex";
}
function closePopup() {
    if (popupBg) popupBg.style.display = "none";
}
function showAmiDetail(idx) {
    const ami = amis[idx];
    let html = `
        <span onclick="window.closePopup && closePopup()" style="position:absolute;top:18px;right:24px;font-size:2em;color:#fff;cursor:pointer;">&times;</span>
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    `;
    html += `<div class="profile-pic" style="background:#7289da;width:92px;height:92px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.2em;color:#fff;">${ami.pseudo[0]}</div>`;
    html += `<div class="pseudo" style="font-size:1.4em;color:#4dd0ff;">${ami.pseudo}</div>`;
    html += `<div style="margin:8px 0 12px 0;font-weight:bold;">Moyenne générale : ${etoiles(moyenne(ami.notes))}</div>`;

    html += `<div style="margin-bottom:12px;"><b>Notes par jeu :</b></div>`;
    Object.entries(ami.notes).forEach(([jeu, note]) => {
        html += `<div style="margin-bottom:7px;"><span style="color:#ffcc4d;font-weight:bold;">${jeu}</span> : <span style="color:#fff;">${etoiles(note)}</span></div>`;
    });

    html += `<button style="margin-top:20px;background:#ffcc4d;color:#23272a;padding:10px 28px;font-weight:bold;border-radius:12px;border:none;font-size:1em;cursor:pointer;" id="compare-btn">Comparer</button>`;
    html += `</div>`;

    showPopup(html);

    document.getElementById('compare-btn').onclick = function() {
        compareFirst = idx;
        closePopup();
        modeComparison = true;
        showHint("Sélectionne un autre ami à comparer !");
    };
    window.closePopup = closePopup;
}

// ---------- COMPARAISON ----------
function showComparePopup(idx1, idx2) {
    const ami1 = amis[idx1], ami2 = amis[idx2];
    const jeux = Array.from(new Set([
        ...Object.keys(ami1.notes),
        ...Object.keys(ami2.notes)
    ]));

    let html = `
        <span onclick="window.closePopup && closePopup()" style="position:absolute;top:18px;right:24px;font-size:2em;color:#fff;cursor:pointer;">&times;</span>
        <div style="display:flex;gap:32px;align-items:flex-start;margin-bottom:18px;">
            <div style="flex:1;">
                <div class="profile-pic" style="background:#7289da;width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.7em;color:#fff;margin:auto 0 12px 0;">${ami1.pseudo[0]}</div>
                <div style="font-weight:bold;font-size:1.1em;margin-bottom:9px;color:#4dd0ff;">${ami1.pseudo}</div>
                <div>Moyenne : ${etoiles(moyenne(ami1.notes))}</div>
            </div>
            <div style="align-self:center;font-size:2.1em;color:#ffcc4d;">VS</div>
            <div style="flex:1;">
                <div class="profile-pic" style="background:#7289da;width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.7em;color:#fff;margin:auto 0 12px 0;">${ami2.pseudo[0]}</div>
                <div style="font-weight:bold;font-size:1.1em;margin-bottom:9px;color:#4dd0ff;">${ami2.pseudo}</div>
                <div>Moyenne : ${etoiles(moyenne(ami2.notes))}</div>
            </div>
        </div>
        <div style="margin-top:12px;">
            <b>Comparaison par jeu :</b>
            <div style="margin-top:12px;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr>
                            <th style="color:#4dd0ff;font-size:1.08em;padding:7px 0;">Jeu</th>
                            <th style="color:#fff;font-size:1.08em;padding:7px 0;">${ami1.pseudo}</th>
                            <th></th>
                            <th style="color:#fff;font-size:1.08em;padding:7px 0;">${ami2.pseudo}</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    let score1 = 0, score2 = 0;

    for (const jeu of jeux) {
        const n1 = ami1.notes[jeu] ?? 0;
        const n2 = ami2.notes[jeu] ?? 0;
        let cell1 = `<span>${etoiles(n1)}</span>`;
        let cell2 = `<span>${etoiles(n2)}</span>`;

        // ---- Correction : victoire seulement si les deux ont une note > 0
        if (n1 > n2 && n1 > 0 && n2 > 0) {
            cell1 = `<span style="font-weight:bold;color:#4dd0ff;background:#18284722;padding:4px 7px;border-radius:7px;">${etoiles(n1)} 🏆</span>`;
            score1++;
        }
        if (n2 > n1 && n1 > 0 && n2 > 0) {
            cell2 = `<span style="font-weight:bold;color:#4dd0ff;background:#18284722;padding:4px 7px;border-radius:7px;">${etoiles(n2)} 🏆</span>`;
            score2++;
        }
        if (n1 === n2 && n1 > 0 && n2 > 0) {
            cell1 = `<span style="color:#ffcc4d;">${etoiles(n1)}</span>`;
            cell2 = `<span style="color:#ffcc4d;">${etoiles(n2)}</span>`;
        }

        // Ligne grisée si un des deux n'a pas de note
        let styleRow = '';
        if (n1 === 0 || n2 === 0) styleRow = 'background:#23272a88;color:#888;';

        html += `
        <tr style="${styleRow}">
            <td style="color:#4dd0ff;padding:6px 0;text-align:left;font-weight:500;">${jeu}</td>
            <td style="text-align:center;">${cell1}</td>
            <td style="color:#7289da;font-weight:bold;text-align:center;">vs</td>
            <td style="text-align:center;">${cell2}</td>
        </tr>
        `;
    }

    html += `
                    </tbody>
                </table>
                <div style="margin-top:18px;font-weight:bold;font-size:1.14em;text-align:center;">
                    <span style="color:#4dd0ff;">${ami1.pseudo}</span> ${score1} - ${score2} <span style="color:#4dd0ff;">${ami2.pseudo}</span>
                </div>
                <div style="margin-top:7px;font-size:1em;">
                    <b>Vainqueur : ${
                        score1 > score2 ? `<span style="color:#4dd0ff;">${ami1.pseudo}</span> 🏆`
                        : score2 > score1 ? `<span style="color:#4dd0ff;">${ami2.pseudo}</span> 🏆`
                        : '<span style="color:#ffcc4d;">Égalité !</span>'
                    }</b>
                </div>
            </div>
        </div>
    `;

    showPopup(html);
    window.closePopup = closePopup;
}

function showHint(txt) {
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
        hint.style.zIndex = 10002;
        document.body.appendChild(hint);
    }
    hint.textContent = txt;
    hint.style.display = 'block';
    clearTimeout(hint.timeout);
    hint.timeout = setTimeout(() => { hint.style.display = 'none'; }, 3000);
}

// --------- BOUTONS ET CLASSEMENTS ANIMÉS ---------

function setupBtn() {
    const btnShow = document.getElementById('show-all-friends');
    const btnRetour = document.getElementById('btn-retour');
    const btnClassements = document.getElementById('btn-classements');
    if (btnShow && btnRetour) {
        btnShow.onclick = function() {
            renderAllFriends();
            btnShow.style.display = 'none';
            btnClassements.style.display = 'none';
            btnRetour.style.display = 'inline-block';
        };
        btnRetour.onclick = function() {
            resetClassementDisplay();
            document.getElementById('friends-container').innerHTML = '';
            btnShow.style.display = 'inline-block';
            btnClassements.style.display = 'inline-block';
            btnShow.disabled = false;
            btnShow.innerText = "👥 Voir tous les amis";
            btnRetour.style.display = 'none';
        };
    }
    if (btnClassements) {
        btnClassements.onclick = showClassementsMenu;
    }
}

// --------- MENU CLASSEMENTS ---------
function showClassementsMenu() {
    resetClassementDisplay();
    document.getElementById('show-all-friends').style.display = 'none';
    document.getElementById('btn-classements').style.display = 'none';
    document.getElementById('btn-retour').style.display = 'inline-block';
    const container = document.getElementById('friends-container');
    container.innerHTML = `
        <div id="classement-btns" style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:16px;">
            <button class="btn-main" onclick="window.showClassementGeneral()">Classement général</button>
            ${Object.keys(amis.reduce((acc, ami) => Object.assign(acc, ami.notes), {})).map(jeu =>
                `<button class="btn-main" onclick="window.showClassementJeu('${jeu}')">Classement ${jeu}</button>`
            ).join('')}
        </div>
        <div id="classement-anim" style="min-height:220px;"></div>
    `;
    btns = document.getElementById('classement-btns');
    window.showClassementGeneral = showClassementGeneral;
    window.showClassementJeu = showClassementJeu;
}

// --------- ANIMATION CLASSEMENT ---------
function resetClassementDisplay() {
    classementTimeouts.forEach(id => clearTimeout(id));
    classementTimeouts = [];
}
function showClassementGeneral() {
    showClassementAnim("Classement général", amis.map(a => ({
        pseudo: a.pseudo,
        note: moyenne(a.notes),
    })));
}
function showClassementJeu(jeu) {
    showClassementAnim("Classement " + jeu, amis.map(a => ({
        pseudo: a.pseudo,
        note: a.notes[jeu] ?? 0,
    })), jeu);
}
function showClassementAnim(titre, joueurs, jeu) {
    resetClassementDisplay();
    joueurs = joueurs.filter(j => j.note > 0);
    joueurs.sort((a, b) => a.note - b.note); // du plus faible au plus fort

    const container = document.getElementById('classement-anim');
    container.innerHTML = `<div style="font-size:1.4em;color:#4dd0ff;text-align:center;margin-bottom:20px;">${titre}</div>
    <div id="podium-classement" style="margin-bottom:30px;min-height:180px;display:flex;justify-content:center;align-items:flex-end;gap:18px;"></div>
    <div id="list-classement"></div>
    `;
if (btns) {
    btns.classList.remove('fade-in');
    btns.classList.add('fade-out');
    setTimeout(() => { btns.style.display = "none"; }, 600);
}


    // Affiche du 7e au 4e avec délai
    let idx = 0, total = joueurs.length;
    function showNext() {
        if (total - idx <= 3) {
            showPodium(joueurs.slice(-3).reverse());
            return;
        }
        const j = joueurs[idx];
        document.getElementById('list-classement').innerHTML =
            `<div style="margin:12px 0;padding:8px 20px;border-radius:9px;background:#23272a99;display:flex;align-items:center;justify-content:center;font-size:1.1em;gap:18px;">
                <span style="color:#aaa;width:36px;display:inline-block;text-align:center;">#${total-idx}</span>
                <span style="font-weight:bold;width:120px;display:inline-block;">${j.pseudo}</span>
                <span style="color:#ffcc4d;font-weight:bold;">${etoiles(j.note)}</span>
            </div>` + document.getElementById('list-classement').innerHTML;
        idx++;
        classementTimeouts.push(setTimeout(showNext, 5000));
    }
    if (joueurs.length > 3) showNext();
    else showPodium(joueurs.slice(-3).reverse());
}

// --------- PODIUM ANIMÉ ---------
function showPodium(top3) {
    const podium = document.getElementById('podium-classement');
    podium.innerHTML = "";

    const [first, second, third] = [top3[0], top3[1], top3[2]];


    // Place 3 (slide-in-left)
    setTimeout(() => {
        const div = document.createElement('div');
        div.id = 'podium3';
        div.className = 'slide-in-left';
        div.style.width = "90px";
        div.style.height = "80px";
        div.style.background = "#181822";
        div.style.borderRadius = "12px 12px 0 0";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.alignItems = "center";
        div.style.justifyContent = "flex-end";
        div.style.position = "relative";
        div.style.boxShadow = "0 2px 16px #7289da33";
        div.innerHTML = `
            <div style="position:absolute;top:-34px;width:62px;height:62px;background:#7289da;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8em;color:#fff;border:3px solid #b87333;">${third ? third.pseudo[0] : ""}</div>
            <span style="margin-top:28px;font-weight:bold;">3</span>
            <span style="color:#ffcc4d;font-weight:bold;">${third ? etoiles(third.note) : ""}</span>
            <span style="font-size:1.07em;">${third ? third.pseudo : ""}</span>
        `;
        podium.appendChild(div);
    }, 0);

    // Place 1 (slide-in-bottom)
    setTimeout(() => {
        const div = document.createElement('div');
        div.id = 'podium1';
        div.className = 'slide-in-bottom';
        div.style.width = "90px";
        div.style.height = "130px";
        div.style.background = "#23272a";
        div.style.borderRadius = "12px 12px 0 0";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.alignItems = "center";
        div.style.justifyContent = "flex-end";
        div.style.position = "relative";
        div.style.boxShadow = "0 2px 16px #ffcc4d55";
        div.innerHTML = `
            <div style="position:absolute;top:-54px;width:80px;height:80px;background:#d4af37;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.2em;color:#182135;border:4px solid #fff;">${first ? first.pseudo[0] : ""}</div>
            <span style="margin-top:48px;font-weight:bold;font-size:1.3em;">1</span>
            <span style="color:#ffcc4d;font-weight:bold;">${first ? etoiles(first.note) : ""}</span>
            <span style="font-size:1.12em;">${first ? first.pseudo : ""}</span>
        `;
        podium.appendChild(div);
    }, 5000);

    // Place 2 (slide-in-right)
    setTimeout(() => {
        const div = document.createElement('div');
        div.id = 'podium2';
        div.className = 'slide-in-right';
        div.style.width = "90px";
        div.style.height = "95px";
        div.style.background = "#1a1a24";
        div.style.borderRadius = "12px 12px 0 0";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.alignItems = "center";
        div.style.justifyContent = "flex-end";
        div.style.position = "relative";
        div.style.boxShadow = "0 2px 16px #7289da44";
        div.innerHTML = `
            <div style="position:absolute;top:-38px;width:70px;height:70px;background:#7289da;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2em;color:#fff;border:3px solid #d4af37;">${second ? second.pseudo[0] : ""}</div>
            <span style="margin-top:40px;font-weight:bold;">2</span>
            <span style="color:#ffcc4d;font-weight:bold;">${second ? etoiles(second.note) : ""}</span>
            <span style="font-size:1.09em;">${second ? second.pseudo : ""}</span>
        `;
        podium.appendChild(div);

        // 5 secondes après le dernier podium, on refait apparaitre les boutons de classement en fade-in
        setTimeout(() => {
            if (btns) {
                btns.style.display = 'flex';
                btns.classList.remove('fade-out');
                btns.classList.add('fade-in');
            }
        }, 5000);
    }, 10000);
}

// ---------- INIT AU CHARGEMENT ----------
document.addEventListener('DOMContentLoaded', function() {
    setupBtn();
});
document.addEventListener('DOMContentLoaded', function() {
    setupBtn();

    // Ajoute la redirection vers l'accueil
    const btnAccueil = document.getElementById('btn-accueil');
    if (btnAccueil) {
        btnAccueil.onclick = function() {
            window.location.href = "index.html"; // Ou ton vrai accueil
        }
    }
});
