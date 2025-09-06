# Test de Autenticación - e-commerce API

## Endpoints disponibles:

**Base URL**: `http://localhost:3000/api/v1/users`

### 1. Registrar nuevo usuario
```bash
# POST /api/v1/users/register
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 2. Iniciar sesión
```bash
# POST /api/v1/users/login
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 3. Ver perfil (requiere token)
```bash
# GET /api/v1/users/profile
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Listar usuarios (solo admin)
```bash
# GET /api/v1/users
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer TOKEN_DE_ADMIN"
```

### 5. Ver usuario específico (solo propietario o admin)
```bash
# GET /api/v1/users/:id
curl -X GET http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

## Usuarios de prueba pre-creados:

1. **Administrador**:
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: `admin`

2. **Cliente**:
   - Email: `customer@example.com`
   - Password: `customer123`
   - Role: `customer`

## Flujo de prueba recomendado:

1. Hacer login con admin o customer
2. Copiar el token de la respuesta
3. Usar el token en los headers para rutas protegidas

## Códigos de respuesta:

- **200**: OK
- **201**: Creado
- **400**: Bad Request (datos inválidos)
- **401**: Unauthorized (token inválido o faltante)
- **403**: Forbidden (sin permisos)
- **404**: Not Found
- **409**: Conflict (email ya existe)
