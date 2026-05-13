import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { superadminGuard } from './core/guards/superadmin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./pages/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent)
  },
  {
    path: 'restablecer-password/:token',
    loadComponent: () => import('./pages/restablecer-password/restablecer-password.component').then(m => m.RestablecerPasswordComponent)
  },
  {
    path: 'entrenamientos',
    loadComponent: () => import('./pages/entrenamientos/entrenamientos.component').then(m => m.EntrenamientosComponent)
  },
  {
    path: 'galerias',
    loadComponent: () => import('./pages/galerias/galerias.component').then(m => m.GaleriasComponent)
  },
  {
    path: 'noticias',
    loadComponent: () => import('./pages/noticias/noticias.component').then(m => m.NoticiasComponent)
  },
  {
    path: 'historia',
    loadComponent: () => import('./pages/historia/historia.component').then(m => m.HistoriaComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil/editar',
    loadComponent: () => import('./pages/editar-perfil/editar-perfil.component').then(m => m.EditarPerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'noticias',
        pathMatch: 'full'
      },
      {
        path: 'noticias',
        loadComponent: () => import('./pages/admin/crud-noticias/crud-noticias.component').then(m => m.CrudNoticiasComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'imagenes',
        loadComponent: () => import('./pages/admin/crud-imagenes/crud-imagenes.component').then(m => m.CrudImagenesComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'entrenamientos',
        loadComponent: () => import('./pages/admin/crud-entrenamientos/crud-entrenamientos.component').then(m => m.CrudEntrenamientosComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'ver-usuarios',
        loadComponent: () => import('./pages/admin/ver-usuarios/ver-usuarios.component').then(m => m.VerUsuariosComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/crud-usuarios/crud-usuarios.component').then(m => m.CrudUsuariosComponent),
        canActivate: [superadminGuard]
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('./pages/admin/editar-usuario/editar-usuario.component').then(m => m.EditarUsuarioComponent),
        canActivate: [superadminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/inicio'
  }
];
