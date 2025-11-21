# auth.py
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
import jwt
from authlib.integrations.starlette_client import OAuth
from config import settings
import secrets
from typing import Optional
from datetime import datetime, timedelta

# Configuración OAuth
oauth = OAuth()

# Configurar Google OAuth con parámetros explícitos
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
    },
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    api_base_url='https://www.googleapis.com/',
)

# Esquema de seguridad
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Crea un token JWT con los datos proporcionados
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "lanacion-auth-api"
    })
    
    try:
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating token: {str(e)}"
        )

def verify_token(token: str = Depends(security)):
    """
    Verifica y decodifica un token JWT
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token_value = token.credentials
        payload = jwt.decode(
            token_value,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_exp": True}
        )
        
        email = payload.get("email")
        if email is None:
            raise credentials_exception
            
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception:
        raise credentials_exception

def validate_email_domains(email: str):
    """
    Valida que el email sea de los dominios permitidos: lanacion.com.ar O gmail.com
    """
    if not email or not isinstance(email, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email inválido"
        )
    
    allowed_domains = ['lanacion.com.ar', 'gmail.com']
    domain = email.split('@')[-1] if '@' in email else ''
    
    if domain not in allowed_domains:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Solo se permiten usuarios con dominios @lanacion.com.ar o @gmail.com. Dominio detectado: @{domain}"
        )
    return email