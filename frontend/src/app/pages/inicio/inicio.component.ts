import { Component, OnInit, OnDestroy, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Slide {
  imagen: string;
  titulo: string;
  descripcion: string;
}

interface Categoria {
  nombre: string;
  imagen: string;
  descripcion: string;
  ruta: string;
}

interface RedSocial {
  nombre: string;
  icono: string;
  url: string;
  color: string;
}

interface Auspiciador {
  nombre: string;
  logo: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, OnDestroy {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Hero Carousel
  slides = signal<Slide[]>([
    {
      imagen: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920',
      titulo: 'Bienvenido a Linares Colleges',
      descripcion: 'Excelencia deportiva y formación integral'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920',
      titulo: 'Formamos Campeones',
      descripcion: 'Más de 30 años de trayectoria deportiva'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1920',
      titulo: 'Únete a Nosotros',
      descripcion: 'Entrenamientos profesionales para todas las categorías'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920',
      titulo: 'Pasión por el Deporte',
      descripcion: 'Desarrollo técnico y valores deportivos'
    }
  ]);

  slideActual = signal<number>(0);
  private intervaloCarrusel: any;

  // Categorías
  categorias = signal<Categoria[]>([
    {
      nombre: 'Entrenamientos',
      imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
      descripcion: 'Sesiones profesionales para todos los niveles',
      ruta: '/entrenamientos'
    },
    {
      nombre: 'Noticias',
      imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
      descripcion: 'Mantente informado de todas nuestras actividades',
      ruta: '/noticias'
    },
    {
      nombre: 'Historia',
      imagen: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=600',
      descripcion: 'Conoce nuestra trayectoria y logros',
      ruta: '/historia'
    },
    {
      nombre: 'Galerías',
      imagen: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600',
      descripcion: 'Revive los mejores momentos',
      ruta: '/galerias'
    }
  ]);

  // Redes Sociales
  redesSociales = signal<RedSocial[]>([
    {
      nombre: 'Instagram',
      icono: '📷',
      url: 'https://instagram.com/linarescolleges',
      color: '#E1306C'
    },
    {
      nombre: 'Facebook',
      icono: '👥',
      url: 'https://facebook.com/linarescolleges',
      color: '#1877F2'
    },
    {
      nombre: 'Gmail',
      icono: '✉️',
      url: 'mailto:contacto@linarescolleges.cl',
      color: '#EA4335'
    }
  ]);

  // Auspiciadores
  auspiciadores = signal<Auspiciador[]>([
    { nombre: 'Sponsor 1', logo: 'https://via.placeholder.com/200x100/667eea/ffffff?text=Sponsor+1' },
    { nombre: 'Sponsor 2', logo: 'https://via.placeholder.com/200x100/764ba2/ffffff?text=Sponsor+2' },
    { nombre: 'Sponsor 3', logo: 'https://via.placeholder.com/200x100/f093fb/ffffff?text=Sponsor+3' },
    { nombre: 'Sponsor 4', logo: 'https://via.placeholder.com/200x100/4facfe/ffffff?text=Sponsor+4' },
    { nombre: 'Sponsor 5', logo: 'https://via.placeholder.com/200x100/00f2fe/ffffff?text=Sponsor+5' },
    { nombre: 'Sponsor 6', logo: 'https://via.placeholder.com/200x100/43e97b/ffffff?text=Sponsor+6' }
  ]);

  // Estadísticas
  estadisticas = signal([
    { valor: '30+', label: 'Años de Trayectoria', icono: '🏆' },
    { valor: '500+', label: 'Jugadores Formados', icono: '⚽' },
    { valor: '50+', label: 'Torneos Ganados', icono: '🥇' },
    { valor: '15+', label: 'Entrenadores Pro', icono: '👨‍🏫' }
  ]);

  ngOnInit(): void {
    // Solo iniciar el carrusel en el navegador, no en SSR
    if (this.isBrowser) {
      this.iniciarCarrusel();
    }
  }

  ngOnDestroy(): void {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  iniciarCarrusel(): void {
    this.intervaloCarrusel = setInterval(() => {
      this.siguienteSlide();
    }, 5000);
  }

  siguienteSlide(): void {
    const totalSlides = this.slides().length;
    this.slideActual.set((this.slideActual() + 1) % totalSlides);
  }

  anteriorSlide(): void {
    const totalSlides = this.slides().length;
    this.slideActual.set((this.slideActual() - 1 + totalSlides) % totalSlides);
  }

  irASlide(index: number): void {
    this.slideActual.set(index);
    // Reiniciar el intervalo
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
      this.iniciarCarrusel();
    }
  }
}
