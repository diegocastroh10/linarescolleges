export enum UserRole {
  PERSONA = 'persona',
  ADMINISTRADOR = 'administrador',
  SUPERADMIN = 'superadmin',
}

export interface Usuario {
  _id: string;
  email: string;
  nombrePersonal: string;
  nombreUsuario: string;
  rut: string;
  fechaNacimiento: string;
  posicion: string;
  telefono: string;
  direccion: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
  rol: UserRole;
  fotoPerfil?: string;
}

export interface UsuarioRegistro {
  email: string;
  password: string;
  nombrePersonal: string;
  nombreUsuario: string;
  rut: string;
  fechaNacimiento: string;
  posicion: string;
  telefono: string;
  direccion: string;
  nombreApoderado?: string;
  telefonoApoderado?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  mensaje: string;
  accessToken: string;
}
