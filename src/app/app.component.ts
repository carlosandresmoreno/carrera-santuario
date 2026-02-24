import {
  Component,
  ChangeDetectionStrategy,
  inject,
  afterNextRender,
} from '@angular/core';
import { HeroComponent } from './features/hero/hero.component';
import { HistoriaComponent } from './features/historia/historia.component';
import { RoutesInfoComponent } from './features/routes-info/routes-info.component';
import { SocialWallComponent } from './features/social-wall/social-wall.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { FloatingWhatsappComponent } from './features/floating-whatsapp/floating-whatsapp.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    HistoriaComponent,
    RoutesInfoComponent,
    SocialWallComponent,
    RegistrationComponent,
    FloatingWhatsappComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    afterNextRender(() => {
      const TITLE =
        'Santuario Corre 5K & 10K 2026 – Segunda Edición | Bosque Campista Tamaná';
      const DESC =
        'Corre 5K o 10K en Santuario, Risaralda el 18 de octubre de 2026. Organizado por jóvenes del Bosque Campista Tamaná en el Paisaje Cultural Cafetero. ¡Inscripciones abiertas desde $85.000 COP!';

      this.seo.updateMeta({
        title: TITLE,
        description: DESC,
        image: 'https://santuariocorre.com/assets/og-image.jpg',
        url: 'https://santuariocorre.com/',
        keywords:
          'santuario corre, carrera santuario 2026, 5k risaralda, 10k risaralda, ' +
          'atletismo eje cafetero, bosque campista tamana, carrera atletica colombia, ' +
          'paisaje cultural cafetero, correr risaralda, inscripcion carrera 2026',
      });

      this.seo.setCanonical('/');
      this.seo.injectJsonLd(this.seo.buildRaceSchema());
    });
  }
}
