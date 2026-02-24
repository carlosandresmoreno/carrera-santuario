import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './features/hero/hero.component';
import { HistoriaComponent } from './features/historia/historia.component';
import { RoutesInfoComponent } from './features/routes-info/routes-info.component';
import { SocialWallComponent } from './features/social-wall/social-wall.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    HistoriaComponent,
    RoutesInfoComponent,
    SocialWallComponent,
    RegistrationComponent,
  ],
  template: `
    <main>
      <app-hero />

      @defer (on viewport) {
        <app-historia />
      } @placeholder {
        <div class="section-skeleton" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-routes-info />
      } @placeholder {
        <div class="section-skeleton" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-social-wall />
      } @placeholder {
        <div class="section-skeleton" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-registration />
      } @placeholder {
        <div class="section-skeleton" aria-hidden="true"></div>
      }
    </main>

    <!-- Footer -->
    <footer class="site-footer" role="contentinfo">
      <div class="section-container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">🌿 Santuario Corre 2026</span>
          <p class="footer-tagline">
            Segunda Edición · 5K &amp; 10K · Santuario, Risaralda
          </p>
        </div>
        <nav class="footer-nav" aria-label="Navegación del pie de página">
          <a href="#historia" aria-label="Nuestra historia">Nuestra Historia</a>
          <a href="#modalidades" aria-label="Ver modalidades">Modalidades</a>
          <a href="#instagram" aria-label="Ver galería">Galería</a>
          <a href="#inscripcion" aria-label="Inscribirse">Inscripción</a>
        </nav>
        <p class="footer-copy">
          &copy; 2026 Santuario Corre · Bosque Campista Tamaná. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      main {
        min-height: 100vh;
        background: var(--color-bg);
      }

      .section-skeleton {
        height: 200px;
        background: var(--color-bg-surface);
      }

      .site-footer {
        background: var(--color-bg-surface);
        border-top: 1px solid var(--color-border);
        padding: 3rem 0;
      }

      .footer-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-logo {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .footer-tagline {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        margin: 0.25rem 0 0;
      }

      .footer-nav {
        display: flex;
        gap: 2rem;

        a {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color var(--transition-fast);

          &:hover {
            color: var(--color-accent);
          }
        }
      }

      .footer-copy {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin: 0;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
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
  }
}
