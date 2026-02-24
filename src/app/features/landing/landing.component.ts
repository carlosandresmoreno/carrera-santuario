import {
  Component,
  ChangeDetectionStrategy,
  inject,
  afterNextRender,
} from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { HistoriaComponent } from '../historia/historia.component';
import { RoutesInfoComponent } from '../routes-info/routes-info.component';
import { SocialWallComponent } from '../social-wall/social-wall.component';
import { RegistrationComponent } from '../registration/registration.component';
import { StatusCheckComponent } from '../status-check/status-check.component';
import { FloatingWhatsappComponent } from '../floating-whatsapp/floating-whatsapp.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    HistoriaComponent,
    RoutesInfoComponent,
    SocialWallComponent,
    RegistrationComponent,
    StatusCheckComponent,
    FloatingWhatsappComponent,
  ],
  template: `
    <main>
      <app-hero />

      @defer (on idle) {
        <app-historia />
      } @placeholder {
        <div class="section-skeleton skeleton-shimmer" aria-hidden="true"></div>
      }

      <!-- CTA Interstitial Banner -->
      <div class="cta-interstitial">
        <div class="section-container interstitial-inner">
          <span class="interstitial-icon">🏃</span>
          <p class="interstitial-text">
            <strong>+350 atletas ya corrieron.</strong> Este año los cupos son
            limitados.
          </p>
          <a
            href="#inscripcion"
            class="interstitial-btn"
            (click)="scrollTo($event, 'inscripcion')"
            aria-label="Reservar cupo en la carrera"
          >
            ¡Reserva tu cupo ahora!
          </a>
        </div>
      </div>

      @defer (on idle) {
        <app-routes-info />
      } @placeholder {
        <div class="section-skeleton skeleton-shimmer" aria-hidden="true"></div>
      }

      @defer (on idle) {
        <app-social-wall />
      } @placeholder {
        <div class="section-skeleton skeleton-shimmer" aria-hidden="true"></div>
      }

      @defer (on idle) {
        <app-registration />
      } @placeholder {
        <div class="section-skeleton skeleton-shimmer" aria-hidden="true"></div>
      }

      @defer (on idle) {
        <app-status-check />
      } @placeholder {
        <div class="section-skeleton skeleton-shimmer" aria-hidden="true"></div>
      }
    </main>

    <!-- Floating WhatsApp -->
    <app-floating-whatsapp />

    <!-- Footer -->
    <footer class="site-footer" role="contentinfo">
      <div class="footer-glow" aria-hidden="true"></div>
      <div class="section-container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">Santuario Corre 2026</span>
          <p class="footer-tagline">
            Segunda Edición · 5K &amp; 10K · Santuario, Risaralda
          </p>
        </div>

        <div class="footer-divider" aria-hidden="true"></div>

        <nav class="footer-nav" aria-label="Navegación del pie de página">
          <a href="#historia" (click)="scrollTo($event, 'historia')"
            >Nuestra Historia</a
          >
          <a href="#modalidades" (click)="scrollTo($event, 'modalidades')"
            >Modalidades</a
          >
          <a href="#instagram" (click)="scrollTo($event, 'instagram')"
            >Galería</a
          >
          <a
            href="#inscripcion"
            class="footer-cta"
            (click)="scrollTo($event, 'inscripcion')"
            >🔥 Inscríbete</a
          >
        </nav>

        <p class="footer-copy">
          &copy; 2026 Santuario Corre · Bosque Campista Tamaná. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
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

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
