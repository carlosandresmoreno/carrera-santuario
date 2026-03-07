import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CountdownComponent } from '../countdown/countdown.component';
import { RaceStore } from '../../store/race.store';
import { UiService } from '../../core/services/ui.service';

const WHATSAPP_NUMBER = '573116227064';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, CountdownComponent],
  template: `
    <header class="hero-wrapper" role="banner">
      <!-- Navigation -->
      <nav class="hero-nav glass-card" aria-label="Navegación principal">
        <div class="nav-inner section-container">
          <a
            href="#"
            class="nav-logo"
            aria-label="Santuario Corre 5K & 10K – Inicio"
            (click)="$event.preventDefault()"
          >
            <span class="logo-text">Santuario <strong>Corre</strong></span>
          </a>
          <ul class="nav-links" role="list">
            <li>
              <a
                href="#modalidades"
                aria-label="Ver modalidades de carrera"
                (click)="scrollTo($event, 'modalidades')"
                >Modalidades</a
              >
            </li>
            <li>
              <a
                href="#historia"
                aria-label="Nuestra historia"
                (click)="scrollTo($event, 'historia')"
                >Nuestra Historia</a
              >
            </li>
            <li>
              <a
                href="#consulta"
                aria-label="Consultar estado de inscripción"
                (click)="scrollTo($event, 'consulta')"
                >Consultar Estado</a
              >
            </li>
            <li>
              <a
                href="#inscripcion"
                class="nav-cta"
                aria-label="Inscribirse a la carrera"
                (click)="openInscripcion($event)"
                >¡Inscríbete!</a
              >
            </li>
          </ul>
        </div>
      </nav>

      <!-- Hero Content -->
      <section class="hero-content" aria-labelledby="hero-title">
        <!-- Background Image (Placeholder) -->
        <div class="hero-bg-image" aria-hidden="true">
          <img
            ngSrc="/assets/hero-placeholder.webp"
            alt="Corredor en los paisajes cafeteros de Risaralda, Colombia"
            fill
            priority
            fetchpriority="high"
            class="object-cover w-full h-full"
          />
          <div class="hero-overlay" aria-hidden="true"></div>
        </div>

        <!-- Background Video (deferred) -->
        <div class="hero-bg-video" aria-hidden="true">
          @defer (on idle) {
            <video
              autoplay
              muted
              loop
              playsinline
              class="object-cover w-full h-full"
              aria-hidden="true"
            >
              <source src="/assets/hero-video.mp4" type="video/mp4" />
            </video>
          } @placeholder {
            <div class="video-placeholder" aria-hidden="true"></div>
          }
        </div>

        <!-- Text Content -->
        <div class="hero-text section-container">
          <!-- Social Proof Badge -->
          <div
            class="hero-proof animate-fade-in-up"
            style="animation-delay:0.05s"
            aria-label="350 atletas participaron en la primera edición"
          >
            <span class="proof-icon">🏅</span>
            <span>350+ corredores en 2025</span>
            <span class="proof-sep">·</span>
          </div>

          <!-- Event Badge -->
          <div
            class="hero-badge animate-fade-in-up"
            style="animation-delay:0.15s"
          >
            <span>🔥 Inscripciones abiertas</span>
            <span class="badge-sep">—</span>
            <span class="badge-stage"
              >Etapa {{ store.currentStage().name }}</span
            >
          </div>

          <h1
            id="hero-title"
            class="hero-title animate-fade-in-up"
            style="animation-delay:0.3s"
          >
            Corre por Santuario.
            <span class="hero-title-highlight">Corre por Ti.</span>
          </h1>

          <p
            class="hero-subtitle animate-fade-in-up"
            style="animation-delay:0.45s"
          >
            5K &amp; 10K en el corazón del Paisaje Cultural Cafetero.<br />
            350 atletas ya vivieron la primera edición. Este
            <strong>18 de octubre</strong>, la historia se hace más grande.
            <strong>¿Vas a estar?</strong>
          </p>

          <!-- Countdown -->
          <div
            class="hero-countdown animate-fade-in-up"
            style="animation-delay:0.55s"
          >
            <app-countdown />
          </div>

          <!-- CTA Buttons -->
          <div
            class="hero-actions animate-fade-in-up"
            style="animation-delay:0.7s"
          >
            <a
              href="#inscripcion"
              class="btn-primary"
              aria-label="Inscribirse ahora a Santuario Corre 5K & 10K 2026"
              (click)="openInscripcion($event)"
            >
              🏃 ¡Quiero mi cupo! — Desde {{ lowestPrice }}
            </a>
            <button
              class="btn-whatsapp-hero"
              (click)="openWhatsApp()"
              aria-label="Contactar por WhatsApp para inscripción o dudas"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              Pregúntanos por WhatsApp
            </button>
          </div>

          <!-- Location micro-info -->
          <div
            class="hero-location animate-fade-in-up"
            style="animation-delay:0.85s"
          >
            📍 Santuario, Risaralda · Bosque Campista Tamaná
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator" aria-hidden="true">
          <div class="scroll-mouse">
            <div class="scroll-dot"></div>
          </div>
          <span>Descubre más</span>
        </div>
      </section>
    </header>
  `,
  styles: [
    `
      .hero-wrapper {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
      }

      .video-placeholder {
        width: 100%;
        height: 100%;
      }

      /* ── Navbar ── */
      .hero-nav {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 2rem);
        max-width: 1200px;
        z-index: var(--z-nav);
        border-radius: var(--radius-lg);
        padding: 0.875rem 1.5rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(37, 99, 235, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;

          .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: var(--color-text-primary);
            font-size: 1.1rem;
            font-weight: 700;

            .logo-icon {
              font-size: 1.5rem;
            }
            strong {
              color: var(--color-primary);
            }
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
            list-style: none;
            margin: 0;
            padding: 0;

            a {
              color: var(--color-text-primary);
              text-decoration: none;
              font-size: 0.9rem;
              font-weight: 600;
              transition: color var(--transition-fast);

              &:hover {
                color: var(--color-primary);
              }
            }

            .nav-cta {
              background: var(--gradient-primary);
              color: white !important;
              padding: 0.5rem 1.25rem;
              border-radius: var(--radius-full);
              font-weight: 700;
              font-size: 0.85rem;
              transition:
                transform var(--transition-spring),
                box-shadow var(--transition-normal) !important;
              animation: pulse-glow-green 2.5s ease-in-out infinite;

              &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
              }
            }
          }
        }
      }

      @media (max-width: 640px) {
        .hero-nav {
          padding: 0.5rem 0.75rem;
          width: calc(100% - 1rem);
          top: 0.5rem;

          .nav-logo {
            display: none;
          }

          .nav-inner {
            justify-content: center !important;
            gap: 0.75rem;
          }

          .nav-links {
            width: 100%;
            justify-content: center;
            gap: 0.75rem !important;

            li:nth-child(1),
            li:nth-child(2) {
              display: none;
            }

            a {
              font-size: 0.8rem;
              white-space: nowrap;
            }

            .nav-cta {
              padding: 0.5rem 1rem;
              font-size: 0.8rem;
              white-space: nowrap;
            }
          }
        }
      }

      @keyframes pulse-glow-accent {
        0%,
        100% {
          box-shadow: 0 0 12px rgba(244, 162, 97, 0.3);
        }
        50% {
          box-shadow: 0 0 28px rgba(244, 162, 97, 0.6);
        }
      }

      /* ── Hero Section ── */
      .hero-content {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden;
      }

      .hero-bg-image,
      .hero-bg-video {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .hero-bg-image img {
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: var(--gradient-hero);
      }

      .hero-bg-video {
        z-index: 1;

        video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-hero);
        }
      }

      .hero-text {
        position: relative;
        z-index: 2;
        text-align: center;
        padding-top: 6rem;
        padding-bottom: 4rem;
      }

      /* Social Proof */
      .hero-proof {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(37, 211, 102, 0.12);
        border: 1px solid rgba(37, 211, 102, 0.25);
        border-radius: var(--radius-full);
        padding: 0.3rem 1rem;
        font-size: 0.8rem;
        color: rgba(240, 255, 244, 0.9);
        font-weight: 600;
        margin-bottom: 0.75rem;
        letter-spacing: 0.03em;
      }

      .proof-icon {
        font-size: 1rem;
      }

      .proof-sep {
        opacity: 0.4;
      }

      /* Event Badge */
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(244, 162, 97, 0.15);
        border: 1px solid rgba(244, 162, 97, 0.3);
        border-radius: var(--radius-full);
        padding: 0.375rem 1.25rem;
        font-size: 0.85rem;
        color: var(--color-accent-light);
        font-weight: 500;
        margin-bottom: 1.5rem;
        letter-spacing: 0.05em;
      }

      .badge-sep {
        opacity: 0.4;
      }

      .badge-stage {
        font-weight: 700;
        color: var(--color-accent);
      }

      .hero-title {
        font-size: var(--font-size-hero);
        font-weight: 900;
        line-height: var(--line-height-tight);
        color: white;
        margin: 0 0 var(--space-sm);
        text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        text-wrap: balance;
      }

      .hero-title-highlight {
        display: block;
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        color: rgba(240, 255, 244, 0.8);
        margin: 1rem auto 2rem;
        max-width: 640px;
        line-height: 1.7;

        strong {
          color: white;
          font-weight: 700;
        }
      }

      .hero-countdown {
        margin: 1.5rem auto;
        max-width: 540px;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
        background: var(--gradient-accent);
        color: white;
        font-weight: 700;
        padding: 1rem 2.5rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        font-size: 1.1rem;
        letter-spacing: 0.03em;
        box-shadow: var(--shadow-glow-accent);
        transition:
          transform var(--transition-micro),
          box-shadow var(--transition-micro);
        animation: pulse-glow-accent 3s ease-in-out infinite;

        &:hover {
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 0 50px rgba(244, 162, 97, 0.5);
        }
      }

      .btn-whatsapp-hero {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #25d366;
        border: none;
        color: white;
        font-weight: 700;
        padding: 1rem 2rem;
        border-radius: var(--radius-full);
        font-size: 1rem;
        font-family: var(--font-sans);
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
        transition:
          background var(--transition-micro),
          transform var(--transition-micro),
          box-shadow var(--transition-micro);

        &:hover {
          background: #128c7e;
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }
      }

      /* Location */
      .hero-location {
        margin-top: 1.5rem;
        font-size: 0.85rem;
        color: rgba(240, 255, 244, 0.5);
        letter-spacing: 0.05em;
      }

      /* ── Scroll indicator ── */
      .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: rgba(240, 255, 244, 0.5);
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .scroll-mouse {
        width: 24px;
        height: 38px;
        border: 2px solid rgba(240, 255, 244, 0.3);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        padding-top: 6px;
      }

      .scroll-dot {
        width: 4px;
        height: 8px;
        background: var(--color-accent);
        border-radius: 2px;
        animation: scrollDown 2s ease-in-out infinite;
      }

      @keyframes scrollDown {
        0%,
        100% {
          transform: translateY(0);
          opacity: 1;
        }
        50% {
          transform: translateY(8px);
          opacity: 0.3;
        }
      }
    `,
  ],
})
export class HeroComponent {
  protected readonly store = inject(RaceStore);
  private readonly uiService = inject(UiService);
  private readonly platformId = inject(PLATFORM_ID);

  get lowestPrice(): string {
    const stage = this.store.currentStage();
    const min = Math.min(stage.price5k, stage.price10k);
    return '$' + min.toLocaleString('es-CO');
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openInscripcion(event: Event): void {
    event.preventDefault();
    this.uiService.openRegistrationModal();
  }

  openWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const msg =
      '¡Hola! Me interesa inscribirme en *Santuario Corre 5K & 10K 2026*.\n' +
      '¿Pueden darme información sobre las modalidades y precios? ¡Gracias! 🏃';

    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
}
