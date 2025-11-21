import os
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuthError
from auth import oauth, create_access_token, verify_token, validate_email_domains
from config import settings
from starlette.middleware.sessions import SessionMiddleware  
import secrets
from typing import Dict, Any
import urllib.parse

# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = FastAPI(title="Auth La Nación", version="6.0.0")

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY, # Usa la clave que ya tienes en config.py
    max_age=3600 # Opcional: tiempo de vida de la cookie de sesión
)

# CORS middleware - Configuración más permisiva para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En desarrollo permitimos todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Almacenamiento temporal de estados
state_store = {}

@app.get("/")
async def root():
    return {"message": "API de Autenticación La Nación - Dominios permitidos: lanacion.com.ar y gmail.com"}

@app.get("/auth/google")
async def login_google(request: Request):
    """Inicia el flujo de autenticación con Google"""
    try:
        print("🔐 Iniciando flujo de autenticación Google...")
        
        # Generar estado para protección CSRF
        state = secrets.token_urlsafe(16)
        state_store[state] = True
        
        redirect_uri = f"{settings.BACKEND_URL}/auth/google/callback"
        print(f"📍 Redirect URI: {redirect_uri}")
        
        return await oauth.google.authorize_redirect(
            request, 
            redirect_uri,
            state=state
        )
    except Exception as e:
        print(f"❌ Error en login_google: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/auth/google/auto")
async def auto_login_google(request: Request):
    """Endpoint para autenticación automática"""
    try:
        print("🔄 Autenticación automática solicitada...")
        
        state = secrets.token_urlsafe(16)
        state_store[state] = True
        
        redirect_uri = f"{settings.BACKEND_URL}/auth/google/callback"
        
        return await oauth.google.authorize_redirect(
            request, 
            redirect_uri,
            state=state,
            prompt="none"
        )
    except Exception as e:
        print(f"❌ Error en auto_login_google: {e}")
        return JSONResponse(
            {"error": "Authentication failed"}, 
            status_code=500
        )

@app.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    """Callback de Google OAuth"""
    try:
        print("📞 Callback de Google recibido...")
        
        # Verificar si hay error en la respuesta
        error = request.query_params.get('error')
        if error:
            error_description = request.query_params.get('error_description', '')
            print(f"❌ Error de Google: {error} - {error_description}")
            
            if error in ['login_required', 'consent_required']:
                return RedirectResponse(
                    f"{settings.FRONTEND_URL}/login?auto_auth_failed=true"
                )
            else:
                return RedirectResponse(
                    f"{settings.FRONTEND_URL}/login?error=auth_failed&message={error_description}"
                )
        
        # Obtener el token
        token = await oauth.google.authorize_access_token(request)
        print(f"✅ Token respuesta raw: {token.keys()}") 

        # Obtener información del usuario
        user_info = await oauth.google.userinfo(token=token)        
        
        if not user_info:
            print("❌ No se pudo obtener user_info")
            return RedirectResponse(
                f"{settings.FRONTEND_URL}/login?error=no_user_info"
            )
        
        email = user_info.get('email')

        if not email:
            print("❌ No se pudo obtener email")
            return RedirectResponse(
                f"{settings.FRONTEND_URL}/login?error=no_email"
            )
        
        print(f"📧 Email obtenido: {email}")
        
        # Validar dominio de email (lanacion.com.ar O gmail.com)
        try:
            validate_email_domains(email)
            print("✅ Dominio de email validado")
        except HTTPException as e:
            print(f"❌ Dominio no permitido: {email}")
            error_msg = urllib.parse.quote(str(e.detail))
            return RedirectResponse(
                f"{settings.FRONTEND_URL}/login?error=domain_not_allowed&message={error_msg}"
            )
        
        # Crear token JWT
        access_token = create_access_token({
            "sub": user_info["sub"],
            "email": email,
            "name": user_info.get("name", ""),
            "picture": user_info.get("picture", ""),
            "domain": "lanacion.com.ar" if email.endswith('@lanacion.com.ar') else "gmail.com"
        })
        
        print("✅ Token JWT creado")
        
        # Redirigir al frontend con el token
        frontend_url = f"{settings.FRONTEND_URL}"
        encoded_token = urllib.parse.quote(access_token)
        
        redirect_url = f"{frontend_url}?token={encoded_token}"
        print(f"📍 Redirigiendo a: {frontend_url}")
        
        return RedirectResponse(redirect_url)
        
    except OAuthError as e:
        print(f"❌ Error OAuth: {e}")
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error=oauth_error"
        )
    except Exception as e:
        print(f"❌ Error inesperado en callback: {e}")
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error=server_error"
        )

@app.get("/auth/user")
async def get_current_user(payload: Dict[str, Any] = Depends(verify_token)):
    """Obtiene la información del usuario actual"""
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
        "domain": payload.get("domain"),
        "authenticated": True
    }

@app.get("/auth/check")
async def check_auth(payload: Dict[str, Any] = Depends(verify_token)):
    """Verifica si el token es válido"""
    return {
        "authenticated": True,
        "user": {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
            "domain": payload.get("domain")
        }
    }

@app.post("/auth/logout")
async def logout():
    """Cierra la sesión del usuario"""
    return {"message": "Sesión cerrada correctamente"}

# Health check endpoint mejorado
@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy", 
        "service": "lanacion-auth",
        "allowed_domains": ["lanacion.com.ar", "gmail.com"],
        "version": "6.0.0",
        "cors_enabled": True
    })

# Endpoint para favicon (evitar error 404)
@app.get("/favicon.ico")
async def favicon():
    return JSONResponse({"status": "no favicon"})

# Manejo global de excepciones
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint no encontrado"}
    )

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    print(f"❌ Error 500: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"}
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor de autenticación...")
    print(f"📍 Backend URL: {settings.BACKEND_URL}")
    print(f"📍 Frontend URL: {settings.FRONTEND_URL}")
    print("✅ Servicios permitidos: @lanacion.com.ar y @gmail.com")
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="debug"
    )