const apps = [
    {
        title: "Classement Discord",
        description: "Classe tes amis selon leurs skills sur les jeux Discord et découvre les meilleurs du serveur.",
        url: "classement.html"
    },
    {
        title: "🚫 Ne pas cliquer",
        description: "Ne pas cliquer",
        url: "#"
    }
];

function renderApps() {
    const appsList = document.getElementById('apps-list');
    appsList.innerHTML = '';
    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <h2>${app.title}</h2>
            <p>${app.description}</p>
            ${app.url !== "#" 
                ? `<a href="${app.url}" class="btn-main">Ouvrir</a>` 
                : `<button class="btn-main" id="btn-screamer">🚫 NE PAS CLIQUER</button>`
            }
        `;
        appsList.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', renderApps);
