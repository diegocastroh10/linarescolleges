import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SeccionHistoria {
  titulo: string;
  anio: string;
  descripcion: string;
  imagenUrl: string;
  posicionImagen: 'left' | 'right';
}

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historia.component.html',
  styleUrl: './historia.component.scss'
})
export class HistoriaComponent {
  anioFundacion = 1990; // Año de fundación del club
  aniosExistencia = new Date().getFullYear() - this.anioFundacion;

  secciones = signal<SeccionHistoria[]>([
    {
      titulo: 'Los Inicios',
      anio: '1990',
      descripcion: 'Linares Colleges nació de la pasión de un grupo de entusiastas del fútbol que soñaban con formar un club que representara los valores de la comunidad. En sus primeros años, el equipo jugaba en canchas improvisadas, pero el espíritu y la determinación de sus fundadores sentaron las bases de lo que hoy es una institución deportiva reconocida.',
      imagenUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=800&fit=crop',
      posicionImagen: 'left'
    },
    {
      titulo: 'Primeros Éxitos',
      anio: '1995-2000',
      descripcion: 'Durante esta década, el club comenzó a cosechar sus primeros logros importantes. La participación en torneos regionales demostró el potencial del equipo, y la llegada de entrenadores profesionales permitió desarrollar una metodología de juego distintiva que se convertiría en seña de identidad del club.',
      imagenUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=800&fit=crop',
      posicionImagen: 'right'
    },
    {
      titulo: 'Consolidación',
      anio: '2005-2010',
      descripcion: 'El club se consolidó como una potencia local, construyendo su propio estadio y estableciendo divisiones juveniles que formaron a cientos de jóvenes talentos. La filosofía del club siempre ha sido clara: formar no solo futbolistas, sino personas íntegras que representen los valores del deporte.',
      imagenUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=800&fit=crop',
      posicionImagen: 'left'
    },
    {
      titulo: 'Expansión y Crecimiento',
      anio: '2015-2020',
      descripcion: 'La apertura de la academia de fútbol marcó un hito importante. Con instalaciones de primer nivel y un cuerpo técnico altamente calificado, Linares Colleges se posicionó como referente en la formación deportiva. El club no solo creció en lo deportivo, sino también en su compromiso social con la comunidad.',
      imagenUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=800&fit=crop',
      posicionImagen: 'right'
    },
    {
      titulo: 'Era Moderna',
      anio: '2021-Presente',
      descripcion: 'Hoy, Linares Colleges es más que un club de fútbol. Es una familia que reúne a hinchas, jugadores, cuerpo técnico y toda una comunidad que comparte la pasión por este deporte. Con miras al futuro, continuamos trabajando para alcanzar nuevos objetivos y seguir escribiendo nuestra historia.',
      imagenUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=800&fit=crop',
      posicionImagen: 'left'
    }
  ]);

  logros = signal([
    { icono: '🏆', titulo: 'Campeonatos Ganados', cantidad: '15+' },
    { icono: '🎯', titulo: 'Jugadores Formados', cantidad: '500+' },
    { icono: '👥', titulo: 'Socios Activos', cantidad: '1,200+' },
    { icono: '⭐', titulo: 'Años de Historia', cantidad: this.aniosExistencia.toString() }
  ]);
}
