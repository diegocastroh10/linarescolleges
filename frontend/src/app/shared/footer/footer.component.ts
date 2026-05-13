import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'YouTube', icon: '📹', url: 'https://youtube.com' }
  ];

  sponsors = [
    'Auspiciador 1',
    'Auspiciador 2',
    'Auspiciador 3'
  ];
}
