# 📚 Documentación Backend - Linares Colleges

Esta carpeta contiene la documentación específica del backend.

## 📄 Documentos

- `API_TESTS.md` - Documentación completa de endpoints y pruebas de API
- `CAMBIOS_REALIZADOS.md` - Registro de cambios y actualizaciones del backend
- `Postman_Collection.json` - Colección de Postman con todos los endpoints

## 🔗 Enlaces Útiles

- [Documentación NestJS](https://docs.nestjs.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [JWT Strategy](https://docs.nestjs.com/security/authentication)

## 📝 Convenciones API

Todos los endpoints siguen REST conventions:
- `GET` - Lectura de datos
- `POST` - Creación de recursos
- `PUT` - Actualización completa
- `PATCH` - Actualización parcial
- `DELETE` - Eliminación de recursos

## 🔐 Autenticación

La mayoría de endpoints requieren JWT token en el header:
```
Authorization: Bearer <token>
```
