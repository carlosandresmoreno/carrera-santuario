import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RaceStore } from '../../store/race.store';

const WHATSAPP_NUMBER = '573107333078';

@Component({
  selector: 'app-routes-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
  ],
  template: `
    <section
      id="modalidades"
      class="section-padding routes-section"
      aria-labelledby="routes-title"
    >
      <div class="section-container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="section-badge">🏅 Modalidades 2026</div>
          <h2 id="routes-title" class="section-title">
            Elige tu <span class="text-gradient-accent">Distancia</span>
          </h2>
          <p class="section-subtitle">
            No importa si es tu primera carrera o tu reto número 50. Hay una
            categoría perfecta para ti.
          </p>
        </div>

        <!-- Urgency Banner -->
        <div class="urgency-banner" role="alert">
          <span class="urgency-icon">🔥</span>
          <p class="urgency-text">
            Etapa <strong>{{ store.currentStage().name }}</strong> —
            <strong>El precio más bajo del año.</strong>
            Sube el {{ getNextStageDate() }}.
          </p>
        </div>

        <!-- Cards Grid -->
        <div class="routes-grid">
          @for (modality of store.modalities(); track modality.id) {
            <div
              class="route-card glass-card"
              [class.selected]="store.selectedDistance() === modality.id"
              [class.card-10k]="modality.id === '10k'"
              role="article"
              [attr.aria-label]="'Modalidad ' + modality.name"
            >
              <!-- Popularity Badge -->
              @if (modality.id === '5k') {
                <div class="popularity-badge">⭐ Más popular</div>
              }
              @if (modality.id === '10k') {
                <div class="competitor-badge">🏆 Para competidores</div>
              }

              <!-- Card Header -->
              <div class="card-header">
                <div class="card-icon" [attr.aria-hidden]="true">
                  {{ modality.icon }}
                </div>
                <div class="card-title-group">
                  <h3 class="card-title">{{ modality.name }}</h3>
                  <span class="card-distance">{{ modality.distance }}</span>
                </div>
                <div
                  class="card-price-badge"
                  [attr.aria-label]="'Precio: ' + getPrice(modality.id)"
                >
                  {{ getPrice(modality.id) }}
                </div>
              </div>

              <!-- Description -->
              <p class="card-description">{{ modality.description }}</p>

              <!-- Benefits -->
              <ul class="benefits-list" aria-label="Beneficios incluidos">
                @for (benefit of modality.benefits; track benefit) {
                  <li class="benefit-item">
                    <span class="benefit-icon" aria-hidden="true">✓</span>
                    <span>{{ benefit }}</span>
                  </li>
                }
              </ul>

              <!-- CTA Buttons -->
              <a
                href="#inscripcion"
                class="select-btn"
                (click)="store.selectDistance(modality.id)"
                [attr.aria-label]="'Inscribirme en ' + modality.name"
              >
                @if (modality.id === '5k') {
                  🏃 ¡Me inscribo en 5K!
                } @else {
                  🏆 ¡Quiero la 10K!
                }
              </a>
            </div>
          }
        </div>

        <!-- WhatsApp helper -->
        <div class="whatsapp-helper">
          <p>¿Tienes dudas sobre cuál elegir?</p>
          <button
            class="whatsapp-link"
            (click)="openWhatsApp()"
            aria-label="Consultar por WhatsApp cuál modalidad elegir"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            Escríbenos por WhatsApp →
          </button>
        </div>

        <!-- Selection indicator -->
        @if (store.hasSelection()) {
          <div class="selection-message" role="status" aria-live="polite">
            <span>🎯</span>
            <span>
              ¡Excelente elección!
              <strong>{{ store.selectedModality()?.name }}</strong> —
              <a href="#inscripcion" aria-label="Ir a inscripción"
                >Completa tu inscripción ahora →</a
              >
            </span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .routes-section {
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(
            circle,
            rgba(45, 106, 79, 0.15) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
      }

      /* ── Urgency Banner ── */
      .urgency-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        max-width: 680px;
        margin: 0 auto 3rem;
        padding: 1rem 1.5rem;
        background: rgba(244, 162, 97, 0.1);
        border: 1px solid rgba(244, 162, 97, 0.3);
        border-radius: var(--radius-lg);
        animation: pulse-border 3s ease-in-out infinite;
      }

      @keyframes pulse-border {
        0%,
        100% {
          border-color: rgba(244, 162, 97, 0.3);
        }
        50% {
          border-color: rgba(244, 162, 97, 0.6);
        }
      }

      .urgency-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .urgency-text {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        margin: 0;

        strong {
          color: var(--color-accent);
          font-weight: 700;
        }
      }

      /* ── Cards ── */
      .routes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 880px;
        margin: 0 auto;
      }

      .route-card {
        padding: 2rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition:
          transform var(--transition-normal),
          border-color var(--transition-normal),
          box-shadow var(--transition-normal);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--card-color, var(--color-primary)),
            transparent
          );
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        &.selected {
          border-color: var(--card-color, var(--color-primary));
          box-shadow:
            0 0 0 2px rgba(var(--card-color), 0.3),
            var(--shadow-hover) !important;

          &::before {
            opacity: 1;
          }
        }

        &:hover {
          transform: translateY(-6px);
        }
      }

      /* ── Badges ── */
      .popularity-badge,
      .competitor-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.25rem 0.625rem;
        border-radius: var(--radius-full);
        letter-spacing: 0.03em;
      }

      .popularity-badge {
        background: var(--gradient-primary);
        color: white;
      }

      .competitor-badge {
        background: var(--gradient-accent);
        color: white;
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .card-icon {
        font-size: 2.5rem;
        line-height: 1;
        flex-shrink: 0;
      }

      .card-title-group {
        flex: 1;
      }

      .card-title {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--color-text-primary);
        margin: 0 0 0.25rem;
      }

      .card-distance {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      .card-price-badge {
        background: var(--gradient-accent);
        color: white;
        font-weight: 800;
        font-size: 0.85rem;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-full);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .card-description {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        line-height: 1.7;
        margin: 0 0 1.25rem;
      }

      /* ── Benefits ── */
      .benefits-list {
        list-style: none;
        margin: 0 0 1.75rem;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }

      .benefit-item {
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }

      .benefit-icon {
        color: var(--color-primary-light);
        font-weight: 700;
        flex-shrink: 0;
        margin-top: 1px;
      }

      /* ── CTA Button ── */
      .select-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 3rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        border-radius: var(--radius-full);
        background: var(--gradient-primary);
        color: white;
        text-decoration: none;
        font-size: 0.95rem;
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal);

        &:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-glow-green);
        }
      }

      /* ── WhatsApp Helper ── */
      .whatsapp-helper {
        text-align: center;
        margin-top: 2.5rem;

        p {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin: 0 0 0.5rem;
        }
      }

      .whatsapp-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: none;
        color: #25d366;
        font-weight: 600;
        font-size: 0.9rem;
        font-family: var(--font-sans);
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        transition:
          background var(--transition-micro),
          transform var(--transition-micro);

        &:hover {
          background: rgba(37, 211, 102, 0.1);
          transform: translateY(-1px);
        }
      }

      /* ── Selection message ── */
      .selection-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 2.5rem;
        padding: 1rem 2rem;
        background: rgba(45, 106, 79, 0.1);
        border: 1px solid rgba(45, 106, 79, 0.3);
        border-radius: var(--radius-lg);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        color: var(--color-text-secondary);
        font-size: 0.95rem;

        span {
          font-size: 1.5rem;
        }
        strong {
          color: var(--color-accent);
        }
        a {
          color: var(--color-primary-light);
          text-decoration: none;
          font-weight: 600;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    `,
  ],
})
export class RoutesInfoComponent {
  protected store = inject(RaceStore);
  private readonly platformId = inject(PLATFORM_ID);

  getPrice(id: '5k' | '10k'): string {
    const stage = this.store.currentStage();
    const price = id === '5k' ? stage.price5k : stage.price10k;
    return '$' + price.toLocaleString('es-CO') + ' COP';
  }

  getNextStageDate(): string {
    const idx = this.store
      .allStages()
      .findIndex((s) => s.name === this.store.currentStage().name);
    if (idx < this.store.allStages().length - 1) {
      return (
        this.store.allStages()[idx + 1].dateRange.split('–')[0]?.trim() ||
        'pronto'
      );
    }
    return 'pronto';
  }

  openWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const msg =
      '¡Hola! Estoy interesado en Santuario Corre 2026 pero tengo dudas sobre las modalidades.\n' +
      '¿Me pueden ayudar a elegir entre la 5K y la 10K? ¡Gracias! 🏃';

    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
}
