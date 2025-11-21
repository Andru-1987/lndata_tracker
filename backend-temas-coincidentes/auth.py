from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
from authlib.integrations.starlette_client import OAuth
from config import settings
import jwt
from datetime import datetime, timedelta

# 1. Configuración de Google OAuth
# Authlib se encarga de la magia de conectarse con Google
oauth = OAuth()

oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile', # Pedimos ID, email y nombre/foto
    }
)

# 2. Configuración JWT (Seguridad interna)
security = HTTPBearer()

def create_access_token(data: dict):
    """Genera el token de sesión propio de tu app"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "auth-lanacion"
    })
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str = Depends(security)):
    """Verifica que el token que envía el frontend sea válido"""
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

def validate_email_domains(email: str):
    """Tu regla de negocio: Solo Lanacion o Gmail"""
    if not email:
        raise HTTPException(status_code=400, detail="Email no encontrado")
        
    domain = email.split('@')[-1]
    allowed_domains = ['lanacion.com.ar', 'gmail.com']
    
    if domain not in allowed_domains:
        raise HTTPException(
            status_code=403, 
            detail=f"Acceso denegado. El dominio {domain} no está autorizado."
        )
    return email