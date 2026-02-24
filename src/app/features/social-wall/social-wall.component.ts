import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SafeResourcePipe } from '../../core/pipes/safe-resource.pipe';

const INSTAGRAM_HANDLE = 'santuariocorre5ky10k';
const INSTAGRAM_PROFILE = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
const INSTAGRAM_EMBED = `https://www.instagram.com/${INSTAGRAM_HANDLE}/embed/`;

@Component({
  selector: 'app-social-wall',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SafeResourcePipe],
  template: `
    <section
      id="instagram"
      class="section-padding social-section"
      aria-labelledby="social-title"
    >
      <div class="section-container">
        <!-- Header -->
        <div class="section-header">
          <div class="section-badge">📸 Galería</div>
          <h2 id="social-title" class="section-title">
            Vívelo en <span class="text-gradient-accent">Instagram</span>
          </h2>
          <p class="section-subtitle">
            Sigue nuestra historia, momentos únicos de cada edición de la
            Carrera de Santuario.
          </p>
        </div>

        <!-- Instagram Embed with defer -->
        <div class="instagram-wrapper">
          @defer (on viewport) {
            <div class="instagram-grid">
              <!-- Main embed -->
              <div class="instagram-embed-main">
                <iframe
                  [src]="instagramEmbed | safeResource"
                  class="instagram-iframe"
                  frameborder="0"
                  scrolling="no"
                  allowtransparency="true"
                  allow="encrypted-media"
                  title="Perfil de Instagram de Santuario Corre 5K & 10K"
                  loading="lazy"
                ></iframe>
              </div>

              <!-- Side content -->
              <div class="instagram-side">
                <div class="follow-card glass-card">
                  <div class="follow-icon">📱</div>
                  <h3 class="follow-title">Síguenos en Instagram</h3>
                  <p class="follow-text">
                    Fotos, reels y toda la emoción de Santuario Corre en tiempo
                    real. ¡No te pierdas ningún momento!
                  </p>
                  <a
                    [href]="instagramProfile"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-instagram"
                    [attr.aria-label]="
                      'Visitar perfil de Instagram de Santuario Corre (abre en nueva pestaña)'
                    "
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      />
                    </svg>
                    &#64;{{ instagramHandle }}
                  </a>
                </div>

                <div class="stats-card glass-card">
                  <div class="stats-grid">
                    <div
                      class="stat-item"
                      aria-label="350 atletas en la primera edición"
                    >
                      <span class="stat-number">350</span>
                      <span class="stat-label">Atletas 2025</span>
                    </div>
                    <div class="stat-item" aria-label="Segunda edición 2026">
                      <span class="stat-number">2ª</span>
                      <span class="stat-label">Edición</span>
                    </div>
                    <div class="stat-item" aria-label="Santuario, Risaralda">
                      <span class="stat-label">Risaralda</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Banner after Instagram -->
            <div class="insta-cta-banner">
              <p class="insta-cta-text">¿Ya te imaginas cruzando la meta? 🏁</p>
              <a
                href="#inscripcion"
                class="insta-cta-btn"
                aria-label="Ir a inscripción"
                (click)="scrollTo($event, 'inscripcion')"
              >
                Inscríbete y vive la experiencia →
              </a>
            </div>
          } @placeholder (minimum 300ms) {
            <!-- Skeleton loader -->
            <div
              class="skeleton-grid"
              aria-label="Cargando contenido de Instagram..."
              role="status"
            >
              <div
                class="skeleton-main animate-pulse rounded-2xl bg-dark-card"
                aria-hidden="true"
              ></div>
              <div class="skeleton-side" aria-hidden="true">
                <div
                  class="skeleton-card animate-pulse rounded-2xl bg-dark-card"
                ></div>
                <div
                  class="skeleton-card animate-pulse rounded-2xl bg-dark-card"
                ></div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .social-section {
        position: relative;
        background: linear-gradient(
          180deg,
          var(--color-bg) 0%,
          var(--color-bg-surface) 50%,
          var(--color-bg) 100%
        );
      }

      /* ── Instagram Layout ── */
      .instagram-grid,
      .skeleton-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 2rem;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
        }
      }

      /* ── Main Embed ── */
      .instagram-embed-main {
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        min-height: 500px;
      }

      .instagram-iframe {
        width: 100%;
        min-height: 500px;
        border: none;
        display: block;
      }

      /* ── Side ── */
      .instagram-side {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .follow-card {
        padding: 1.75rem;
        text-align: center;
      }

      .follow-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .follow-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 0.75rem;
      }

      .follow-text {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 1.25rem;
      }

      .btn-instagram {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        color: white;
        font-weight: 700;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        font-size: 0.9rem;
        transition:
          transform var(--transition-spring),
          opacity var(--transition-normal);

        &:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
      }

      /* ── Stats ── */
      .stats-card {
        padding: 1.5rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 1.75rem;
        font-weight: 900;
        color: var(--color-accent);
      }

      .stat-label {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      /* ── CTA Banner ── */
      .insta-cta-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 2.5rem;
        padding: 1.25rem 2rem;
        background: linear-gradient(
          135deg,
          rgba(244, 162, 97, 0.1) 0%,
          rgba(45, 106, 79, 0.1) 100%
        );
        border: 1px solid rgba(244, 162, 97, 0.2);
        border-radius: var(--radius-lg);

        @media (max-width: 640px) {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }
      }

      .insta-cta-text {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
      }

      .insta-cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--gradient-accent);
        color: white;
        font-weight: 700;
        font-size: 0.9rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        white-space: nowrap;
        transition:
          transform var(--transition-micro),
          box-shadow var(--transition-micro);

        &:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(244, 162, 97, 0.4);
        }
      }

      /* ── Skeleton ── */
      .skeleton-main {
        min-height: 500px;
        opacity: 0.3;
      }

      .skeleton-side {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .skeleton-card {
        height: 200px;
        opacity: 0.3;
      }
    `,
  ],
})
export class SocialWallComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly instagramEmbed = INSTAGRAM_EMBED;
  readonly instagramProfile = INSTAGRAM_PROFILE;
  readonly instagramHandle = INSTAGRAM_HANDLE;

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
