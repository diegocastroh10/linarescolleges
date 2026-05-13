# Pruebas API REST - Linares Colleges

## Base URL
```
http://localhost:3000/api/usuarios
```

## Endpoints disponibles:

### 1. Registrar un usuario
POST http://localhost:3000/api/usuarios/register
Content-Type: application/json

{
  "email": "jugador1@linarescolleges.cl",
  "password": "password123",
  "nombrePersonal": "Juan Pérez López",
  "nombreUsuario": "juanp1",
  "rut": "12345678-9",
  "fechaNacimiento": "1995-05-15",
  "posicion": "Base",
  "telefono": "+56912345678",
  "direccion": "Av. Libertad 123",
  "nombreApoderado": "María López",
  "telefonoApoderado": "+56987654321"
}

### 2. Login
POST http://localhost:3000/api/usuarios/login
Content-Type: application/json

{
  "email": "jugador1@linarescolleges.cl",
  "password": "password123"
}

### 3. Obtener todos los usuarios
GET http://localhost:3000/api/usuarios

### 4. Buscar usuario por RUT
GET http://localhost:3000/api/usuarios/rut/12345678-9

### 5. Buscar usuario por email
GET http://localhost:3000/api/usuarios/email/jugador1@linarescolleges.cl

### 6. Buscar usuario por ID
GET http://localhost:3000/api/usuarios/id/551b1468-08b0-4290-bf26-a6b03eb2ca90

### 7. Editar usuario por RUT
PUT http://localhost:3000/api/usuarios/rut/12345678-9
Content-Type: application/json

{
  "telefono": "+56987654321",
  "posicion": "Escolta"
}

### 8. Editar usuario por email
PUT http://localhost:3000/api/usuarios/email/jugador1@linarescolleges.cl
Content-Type: application/json

{
  "nombrePersonal": "Juan Carlos Pérez"
}

### 9. Editar usuario por ID
PUT http://localhost:3000/api/usuarios/id/551b1468-08b0-4290-bf26-a6b03eb2ca90
Content-Type: application/json

{
  "telefono": "+56999888777",
  "direccion": "Nueva Calle 456"
}

### 10. Desactivar cuenta (requiere permisos de admin)
DELETE http://localhost:3000/api/usuarios/desactivar/12345678-9
Content-Type: application/json

{
  "isAdmin": true
}

### 11. Eliminar usuario permanentemente (requiere permisos de admin)
DELETE http://localhost:3000/api/usuarios/id/551b1468-08b0-4290-bf26-a6b03eb2ca90
Content-Type: application/json

{
  "isAdmin": true
}
