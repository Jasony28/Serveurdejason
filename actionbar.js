document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('open-action-bar');
    const barContent = document.getElementById('action-bar-content');
    const btnHome = document.getElementById('btn-home');
    const btnLogin = document.getElementById('btn-google-login');
    const btnLogout = document.getElementById('btn-google-logout');
    const userInfo = document.getElementById('user-info');

    openBtn.onclick = function() {
        barContent.classList.toggle('open');
    };
    document.addEventListener('click', function(e) {
        if (!barContent.contains(e.target) && e.target !== openBtn) {
            barContent.classList.remove('open');
        }
    });

    // Accueil
    if (btnHome) {
        btnHome.onclick = function() {
            window.location.href = 'index.html';
        };
    }

    // Google Auth (simu)
    function updateAuthButtons() {
        const logged = !!localStorage.getItem('googleUser');
        btnLogin.style.display = logged ? 'none' : '';
        btnLogout.style.display = logged ? '' : 'none';
        userInfo.style.display = logged ? '' : 'none';
        userInfo.textContent = logged ? "Connecté à Google !" : "";
    }

    btnLogin.onclick = function() {
        localStorage.setItem('googleUser', 'true');
        updateAuthButtons();
        alert("Connecté avec Google (simulé)");
    };
    btnLogout.onclick = function() {
        localStorage.removeItem('googleUser');
        updateAuthButtons();
        alert("Déconnecté !");
    };
    updateAuthButtons();

    // Affiche bouton accueil sauf sur index.html
    if (window.location.pathname.indexOf('index.html') === -1 && btnHome) {
        btnHome.style.display = '';
    }
});
