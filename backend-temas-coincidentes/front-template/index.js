// index.js
const API_URL = "http://localhost:8000"; 

// Elementos del DOM (Definidos aquí, se asignarán eventos después del DOMContentLoaded)
const loginBox = document.getElementById('login-box');
const profileBox = document.getElementById('profile-box');
const deniedBox = document.getElementById('denied-box');
const deniedMessage = document.getElementById('denied-message');
const btnGoogle = document.getElementById('btn-google');


// Función central para mostrar una sola vista
function showView(viewId) {
    [loginBox, profileBox, deniedBox].forEach(box => {
        if (box) box.classList.add('hidden');
    });
    const viewElement = document.getElementById(viewId);
    if (viewElement) {
        viewElement.classList.remove('hidden');
    }
}


// --- Lógica al cargar la página ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Adquirir botones que son null al inicio para asignarles eventos
    const btnLogout = document.getElementById('btn-logout');
    const btnBackToLogin = document.getElementById('btn-back-to-login');
    
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const errorFromUrl = params.get('error');

    window.history.replaceState({}, document.title, "/"); // Limpiar URL

    // 1. Asignar eventos a los botones después de que existen
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            window.location.href = `${API_URL}/auth/login`;
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await fetch(`${API_URL}/auth/logout`); // Notifica al backend (opcional)
            localStorage.removeItem('ln_token'); // Cierre de sesión real (JWT)
            showView('login-box');
        });
    }

    if (btnBackToLogin) {
        btnBackToLogin.addEventListener('click', () => {
            showView('login-box');
        });
    }

    // 2. Manejo de estados (Token o Error)
    if (errorFromUrl === 'forbidden') {
        const messageFromUrl = params.get('message');
        deniedMessage.textContent = decodeURIComponent(messageFromUrl || "Acceso denegado. Solo @lanacion.com.ar o @gmail.com.");
        showView('denied-box');
        return; 
    }

    if (tokenFromUrl) {
        localStorage.setItem('ln_token', tokenFromUrl);
        loadProfile(tokenFromUrl);
        return;
    } 
    
    // 3. Autologin
    const storedToken = localStorage.getItem('ln_token');
    if (storedToken) {
        loadProfile(storedToken);
    } else {
        showView('login-box');
    }
});


// --- Funciones Principales ---

async function loadProfile(token) {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            renderProfileData(user);
            showView('profile-box');
        } else {
            throw new Error("Token inválido o expirado");
        }
    } catch (error) {
        console.error("Verificación fallida:", error.message);
        localStorage.removeItem('ln_token');
        showView('login-box');
    }
}

function renderProfileData(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-pic').src = user.picture;
    
    const domainSpan = document.getElementById('user-domain');
    const domain = user.email.split('@')[1];

    if(domain === 'lanacion.com.ar') {
        domainSpan.textContent = "Staff La Nación";
        domainSpan.style.background = "#e3f2fd";
        domainSpan.style.color = "#004481";
    } else {
        domainSpan.textContent = "Usuario Gmail";
        domainSpan.style.background = "#f0f0f0";
        domainSpan.style.color = "#444";
    }
}