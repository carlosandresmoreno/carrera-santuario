import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const WHATSAPP_NUMBER = '573107333078';

@Component({
  selector: 'app-historia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="historia"
      class="section-padding historia-section"
      aria-labelledby="historia-title"
    >
      <div class="section-container">
        <!-- Header -->
        <div class="section-header">
          <div class="section-badge">Nuestra Historia</div>
          <h2 id="historia-title" class="section-title">
            Lo que empezó como un sueño<br />
            <span class="text-gradient-primary"
              >se convirtió en movimiento</span
            >
          </h2>
        </div>

        <!-- Content grid -->
        <div class="historia-grid">
          <!-- Story text -->
          <div class="historia-text">
            <p class="historia-lead">
              Un grupo de jóvenes del
              <strong>Bosque Campista Tamaná</strong> se atrevió a soñar en
              grande: organizar una carrera atlética que uniera deporte,
              naturaleza y comunidad en el corazón de Santuario.
            </p>
            <p class="historia-body">
              Y lo lograron. El <strong>5 de octubre de 2025</strong>,
              <strong>350 atletas</strong> llegaron a la línea de salida —
              <strong>50% hombres, 50% mujeres</strong> — convirtiendo a
              Santuario Corre en un evento inclusivo que superó todas las
              expectativas.
            </p>
            <p class="historia-body">
              ¿Los fondos recaudados? Se invirtieron en
              <strong>liderazgo juvenil</strong> y programas comunitarios. Cada
              inscripción es más que una carrera — es un aporte al futuro de
              nuestra comunidad.
            </p>
            <p class="historia-cta-text">
              Este año la historia se hace más grande. Nueva categoría 10K
              competitiva, más atletas, más impacto.
              <strong>¿Vas a ser parte?</strong>
            </p>

            <!-- Modalities description -->
            <div class="modality-desc-list">
              <div class="modality-desc glass-card">
                <div class="md-icon">🏃</div>
                <div>
                  <h3>
                    5K Recreativa
                    <span class="popular-badge">⭐ Más popular</span>
                  </h3>
                  <p>
                    Ideal para disfrutar en familia, con amigos y vivir la
                    cultura cafetera. Perfecta para quienes quieren dar sus
                    primeros pasos en el atletismo.
                  </p>
                </div>
              </div>
              <div class="modality-desc glass-card">
                <div class="md-icon">🏆</div>
                <div>
                  <h3>
                    10K Competitiva
                    <span class="new-badge">¡Nueva!</span>
                  </h3>
                  <p>
                    Diseñada para corredores que buscan superarse. Una ruta
                    técnica que combina la belleza del Paisaje Cultural Cafetero
                    con la exigencia de nuestras lomas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats + Social Proof column -->
          <div class="historia-stats">
            <!-- Stat cards -->
            <div class="stat-card glass-card">
              <div class="stat-number">350+</div>
              <div class="stat-label">Atletas en 2025</div>
              <div class="stat-detail">Ya vivieron la experiencia</div>
            </div>

            <div class="stat-card glass-card accent-card">
              <div class="stat-number">2ª</div>
              <div class="stat-label">Edición 2026</div>
              <div class="stat-detail">¡Más grande que nunca!</div>
            </div>

            <!-- Testimonial / Social Proof -->
            <div class="testimonial-card glass-card">
              <div class="testimonial-quote">
                "La mejor carrera en la que he participado. El paisaje es
                increíble y la organización fue de primer nivel."
              </div>
              <div class="testimonial-author">
                <span class="author-avatar">🏅</span>
                <div>
                  <span class="author-name">Participante 2025</span>
                  <span class="author-role">5K Recreativa</span>
                </div>
              </div>
            </div>

            <!-- Mini CTA Card -->
            <div class="mini-cta glass-card accent-border">
              <p class="mini-cta-text">¿Quieres ser de los primeros?</p>
              <div class="mini-cta-actions">
                <a
                  href="#inscripcion"
                  class="mini-cta-btn primary"
                  aria-label="Ir a inscripción"
                  (click)="scrollTo($event, 'inscripcion')"
                >
                  📋 Inscribirme
                </a>
                <button
                  class="mini-cta-btn whatsapp"
                  (click)="openWhatsApp()"
                  aria-label="Consultar por WhatsApp"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .historia-section {
        position: relative;
        background: linear-gradient(
          180deg,
          var(--color-bg) 0%,
          var(--color-bg-surface) 100%
        );
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(244, 162, 97, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
      }

      /* ── Grid layout ── */
      .historia-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 4rem;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 3rem;
        }
      }

      /* ── Text side ── */
      .historia-lead {
        font-size: 1.2rem;
        color: var(--color-text-primary);
        line-height: 1.8;
        margin: 0 0 1.25rem;
        strong {
          color: var(--color-accent);
        }
      }

      .historia-body {
        font-size: 1rem;
        color: var(--color-text-secondary);
        line-height: 1.8;
        margin: 0 0 1.25rem;
        strong {
          color: var(--color-text-primary);
          font-weight: 700;
        }
      }

      .historia-cta-text {
        font-size: 1.1rem;
        color: var(--color-text-primary);
        line-height: 1.8;
        margin: 1.5rem 0 0;
        font-weight: 500;
        strong {
          color: var(--color-accent);
          font-weight: 800;
          font-size: 1.2rem;
        }
      }

      /* ── Modality descriptions ── */
      .modality-desc-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
      }

      .modality-desc {
        display: flex;
        gap: 1.25rem;
        align-items: flex-start;
        padding: 1.25rem 1.5rem;

        h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 0.375rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        p {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.6;
        }
      }

      .md-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .new-badge {
        font-size: 0.65rem;
        font-weight: 700;
        background: var(--gradient-accent);
        color: white;
        padding: 0.15rem 0.5rem;
        border-radius: var(--radius-full);
      }

      .popular-badge {
        font-size: 0.65rem;
        font-weight: 700;
        background: var(--gradient-primary);
        color: white;
        padding: 0.15rem 0.5rem;
        border-radius: var(--radius-full);
      }

      /* ── Stats column ── */
      .historia-stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .stat-card {
        padding: 1.5rem;
        text-align: center;
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 900;
        color: var(--color-primary-light);
        line-height: 1;
      }

      .stat-label {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-top: 0.25rem;
      }

      .stat-detail {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin-top: 0.125rem;
      }

      .accent-card .stat-number {
        color: var(--color-accent);
      }

      /* ── Testimonial ── */
      .testimonial-card {
        padding: 1.5rem;
        border-left: 3px solid var(--color-accent);
      }

      .testimonial-quote {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
        font-style: italic;
        margin-bottom: 1rem;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .author-avatar {
        font-size: 1.5rem;
      }

      .author-name {
        display: block;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .author-role {
        display: block;
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }

      /* ── Mini CTA Card ── */
      .mini-cta {
        padding: 1.5rem;
        text-align: center;
      }

      .accent-border {
        border-color: var(--color-accent) !important;
        border-width: 1px;
      }

      .mini-cta-text {
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-accent);
        margin: 0 0 1rem;
      }

      .mini-cta-actions {
        display: flex;
        gap: 0.75rem;
      }

      .mini-cta-btn {
        flex: 1;
        border: none;
        padding: 0.625rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 700;
        font-family: var(--font-sans);
        cursor: pointer;
        text-decoration: none;
        text-align: center;
        transition:
          transform var(--transition-micro),
          box-shadow var(--transition-micro);

        &:hover {
          transform: scale(1.03);
        }

        &.primary {
          background: var(--gradient-accent);
          color: white;
          &:hover {
            box-shadow: 0 0 20px rgba(244, 162, 97, 0.4);
          }
        }

        &.whatsapp {
          background: rgba(37, 211, 102, 0.15);
          color: #25d366;
          border: 1px solid rgba(37, 211, 102, 0.3);
          &:hover {
            background: rgba(37, 211, 102, 0.25);
          }
        }
      }
    `,
  ],
})
export class HistoriaComponent {
  private readonly platformId = inject(PLATFORM_ID);

  openWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const msg =
      '¡Hola! Vi la historia de Santuario Corre y quiero inscribirme en la segunda edición 2026.\n' +
      '¿Me pueden dar más información? ¡Gracias!';

    const url = 'https://wa.me/573107333078?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
