# main.py
from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuthError
from auth import oauth, verify_token, validate_email_domains, create_access_token # Importamos create_access_token
from config import settings

app = FastAPI(title="Auth La Nación Minimal", version="1.0")

# 1. Middleware de Sesión (Necesario para Authlib)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY, 
    max_age=3600
)

# 2. Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- RUTAS DE AUTENTICACIÓN -----------------

@app.get("/auth/login")
async def login(request: Request):
    """
    Ruta 1: Inicia el flujo de OAuth con Google.
    """
    redirect_uri = f"{settings.BACKEND_URL}/auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    """
    Ruta 2: Recibe la respuesta de Google, valida el dominio y emite el JWT.
    """
    try:
        # 1. Intercambiar código por tokens de Google
        token = await oauth.google.authorize_access_token(request)
        user_info = await oauth.google.userinfo(token=token)        
        
        
        # 2. Validar la regla de negocio (dominio)
        email = validate_email_domains(user_info.get('email'))
        
        # 3. Crear el token de sesión propio (JWT)
        jwt_token = create_access_token(data={
            "id": user_info.get('sub'),
            "email": email,
            "name": user_info.get('name'),
            "picture": user_info.get('picture')
        })

        # 4. Redirigir al frontend con el token en la URL
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?token={jwt_token}",
            status_code=status.HTTP_302_FOUND
        )

    except HTTPException as e:
        # Manejo de errores de validación de dominio (403)
        message = e.detail
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=forbidden&message={message}",
            status_code=status.HTTP_302_FOUND
        )
    except OAuthError:
        # Error de OAuth (ej. el usuario canceló o hubo error de estado)
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=oauth_failed",
            status_code=status.HTTP_302_FOUND
        )
    except Exception as e:
        # Manejo de errores generales
        print(f"Error durante la autenticación: {e}")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=server_error",
            status_code=status.HTTP_302_FOUND
        )


# ----------------- RUTA DE AUTOLOGIN / VERIFICACIÓN -----------------

@app.get("/users/me")
async def read_users_me(user_data: dict = Depends(verify_token)):
    """
    Ruta 3: Verifica el token JWT del cliente y devuelve los datos del usuario.
    """
    return user_data

# ----------------- RUTA DE LOGOUT -----------------

@app.get("/auth/logout")
async def logout():
    """
    Ruta 4: Informa al cliente que debe eliminar el token.
    """
    return {"message": "Sesión cerrada por el lado del cliente."}

# (Opcional) Health check simple
@app.get("/health")
async def health():
    return JSONResponse({"status": "ok", "service": "auth-lanacion"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="debug"
    )