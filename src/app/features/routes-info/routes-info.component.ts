import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RaceStore } from '../../store/race.store';

@Component({
  selector: 'app-routes-info',
  standalone: true,
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
            Dos categorías diseñadas para corredores de todos los niveles.
            Selecciona la que va con tu ritmo.
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

              <!-- CTA Button -->
              <button
                mat-flat-button
                class="select-btn"
                [class.selected-btn]="store.selectedDistance() === modality.id"
                (click)="store.selectDistance(modality.id)"
                [attr.aria-label]="'Seleccionar modalidad ' + modality.name"
                [attr.aria-pressed]="store.selectedDistance() === modality.id"
              >
                @if (store.selectedDistance() === modality.id) {
                  ✅ Seleccionada
                } @else {
                  Seleccionar {{ modality.name }}
                }
              </button>
            </div>
          }
        </div>

        <!-- Selection indicator -->
        @if (store.hasSelection()) {
          <div class="selection-message" role="status" aria-live="polite">
            <span>🎯</span>
            <span>
              Modalidad seleccionada:
              <strong>{{ store.selectedModality()?.name }}</strong> —
              <a href="#inscripcion" aria-label="Ir a inscripción"
                >Completa tu inscripción →</a
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

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-badge {
        display: inline-block;
        background: rgba(45, 106, 79, 0.15);
        border: 1px solid rgba(45, 106, 79, 0.3);
        border-radius: var(--radius-full);
        padding: 0.375rem 1.25rem;
        font-size: 0.85rem;
        color: var(--color-primary-light);
        font-weight: 600;
        margin-bottom: 1rem;
        letter-spacing: 0.08em;
      }

      .section-title {
        font-size: var(--font-size-h2);
        font-weight: 900;
        color: var(--color-text-primary);
        margin: 0 0 1rem;
        line-height: var(--line-height-tight);
      }

      .section-subtitle {
        font-size: 1.1rem;
        color: var(--color-text-secondary);
        max-width: 520px;
        margin: 0 auto;
        line-height: 1.7;
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

      /* ── Button ── */
      .select-btn {
        width: 100%;
        height: 3rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.04em !important;
        border-radius: var(--radius-full) !important;
        background: var(--gradient-primary) !important;
        color: white !important;
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal) !important;

        &:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-glow-green) !important;
        }

        &.selected-btn {
          background: var(--gradient-accent) !important;
          box-shadow: var(--shadow-glow-accent) !important;
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

  getPrice(id: '5k' | '10k'): string {
    const stage = this.store.currentStage();
    const price = id === '5k' ? stage.price5k : stage.price10k;
    return '$' + price.toLocaleString('es-CO') + ' COP';
  }
}
