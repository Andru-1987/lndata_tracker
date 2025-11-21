const API_URL = "http://localhost:8000"; 

// Elementos del DOM
const loginBox = document.getElementById('login-box');
const profileBox = document.getElementById('profile-box');
const btnGoogle = document.getElementById('btn-google');
const btnLogout = document.getElementById('btn-logout');

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ¿Viene un token en la URL (vuelta de Google)?
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
        // Guardar token y limpiar URL
        localStorage.setItem('ln_token', tokenFromUrl);
        window.history.replaceState({}, document.title, "/");
        loadProfile(tokenFromUrl);
    } 
    // 2. ¿Ya teníamos un token guardado?
    else {
        const storedToken = localStorage.getItem('ln_token');
        if (storedToken) {
            loadProfile(storedToken);
        }
    }
});

// Login
btnGoogle.addEventListener('click', () => {
    window.location.href = `${API_URL}/auth/google`;
});

// Logout
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('ln_token');
    location.reload();
});

// Cargar datos del usuario
async function loadProfile(token) {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            showProfileView(data.user);
        } else {
            throw new Error("Token inválido");
        }
    } catch (error) {
        console.error(error);
        localStorage.removeItem('ln_token');
        loginBox.classList.remove('hidden');
        profileBox.classList.add('hidden');
    }
}

// Rellenar el HTML con los datos
function showProfileView(user) {
    loginBox.classList.add('hidden');
    profileBox.classList.remove('hidden');

    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-pic').src = user.picture;
    document.getElementById('user-id').textContent = user.id.substring(0, 8) + "...";
    
    const domainSpan = document.getElementById('user-domain');
    if(user.domain === 'lanacion.com.ar') {
        domainSpan.textContent = "Personal La Nación";
        domainSpan.style.background = "#e3f2fd";
        domainSpan.style.color = "#004488";
    } else {
        domainSpan.textContent = "Usuario Gmail";
        domainSpan.style.background = "#fce4ec";
        domainSpan.style.color = "#c2185b";
    }
}