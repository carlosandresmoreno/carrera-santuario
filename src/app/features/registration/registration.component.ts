import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RaceStore, PRICE_STAGES } from '../../store/race.store';

const WHATSAPP_NUMBER = '573107333078';
const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeeo5UXa64vaFIqhxt0NFxYf-jCCTHa7I4c08sbFw8zFTJFyw/viewform?usp=header';

@Component({
  selector: 'app-registration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  template: `
    <section
      id="inscripcion"
      class="section-padding registration-section"
      aria-labelledby="reg-title"
    >
      <div class="reg-layout section-container">
        <!-- Glow orb -->
        <div class="glow-orb" aria-hidden="true"></div>

        <!-- Left: Main CTA -->
        <div class="reg-content">
          <div class="section-badge">
            ⚡ Últimos días al mejor precio — Etapa {{ currentStage().name }}
          </div>

          <h2 id="reg-title" class="reg-title">
            Tu cupo te está esperando
            <span class="text-gradient-accent">🏁</span>
          </h2>

          <!-- Current stage banner -->
          <div
            class="stage-banner"
            role="status"
            aria-label="Etapa de precios actual"
          >
            <span class="stage-emoji">{{ currentStage().emoji }}</span>
            <span class="stage-info">
              Etapa <strong>{{ currentStage().name }}</strong>
              <em>{{ currentStage().dateRange }}</em>
            </span>
            <span class="stage-badge">Precio actual</span>
          </div>

          <p class="reg-subtitle">
            @if (store.hasSelection()) {
              ¡Excelente elección! Solo falta un paso. Completa tu inscripción
              en la <strong>{{ store.selectedModality()?.name }}</strong> por
              <strong class="price-highlight">{{
                store.selectedPriceLabel()
              }}</strong>
              y asegura tu kit de corredor. 🎽
            } @else {
              3 pasos y estarás en la línea de salida: elige tu distancia, llena
              el formulario y <strong>¡nos vemos el 18 de octubre!</strong>
            }
          </p>

          <!-- Modality quick select -->
          <div
            class="quick-select"
            role="group"
            aria-label="Selección de modalidad"
          >
            @for (modality of store.modalities(); track modality.id) {
              <button
                class="quick-chip"
                [class.active]="store.selectedDistance() === modality.id"
                (click)="store.selectDistance(modality.id)"
                [attr.aria-label]="'Seleccionar ' + modality.name"
                [attr.aria-pressed]="store.selectedDistance() === modality.id"
              >
                <span class="chip-icon">{{ modality.icon }}</span>
                <span class="chip-name">{{ modality.name }}</span>
                <span class="chip-price">
                  {{ chipPrice(modality.id) }}
                </span>
              </button>
            }
          </div>

          <!-- Dual CTA Buttons — side by side -->
          <div class="dual-cta">
            <!-- Primary CTA: Google Forms -->
            <a
              [href]="formUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-form"
              [attr.aria-label]="
                store.hasSelection()
                  ? 'Inscribirme en ' +
                    store.selectedModality()?.name +
                    ' – Formulario oficial'
                  : 'Ir al formulario de inscripción oficial'
              "
            >
              📋 Inscribirme Ahora — Es rápido
            </a>

            <!-- WhatsApp CTA — equally prominent -->
            <button
              class="btn-whatsapp"
              (click)="openWhatsApp()"
              aria-label="Inscribirme o resolver dudas vía WhatsApp"
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
              💬 Quiero inscribirme por WhatsApp
            </button>
          </div>

          <!-- Trust signals -->
          <div class="trust-signals" role="list" aria-label="Garantías">
            <div class="trust-item" role="listitem">
              <span aria-hidden="true">✅</span
              ><span>+350 atletas nos escogieron en 2025</span>
            </div>
            <div class="trust-item" role="listitem">
              <span aria-hidden="true">🎽</span
              ><span>Kit de corredor garantizado</span>
            </div>
            <div class="trust-item" role="listitem">
              <span aria-hidden="true">⏱️</span
              ><span>Tu tiempo, certificado digital</span>
            </div>
            <div class="trust-item" role="listitem">
              <span aria-hidden="true">🔒</span><span>Inscripción segura</span>
            </div>
          </div>
        </div>

        <!-- Right: Info cards -->
        <div class="reg-info">
          <!-- Price stages table -->
          <div
            class="info-card glass-card"
            role="article"
            aria-label="Tabla de precios por etapa"
          >
            <h3 class="info-card-title">💰 Precios por Etapa</h3>
            <div
              class="stages-table"
              role="table"
              aria-label="Precios por etapa de inscripción"
            >
              <div class="stages-header" role="row">
                <span role="columnheader">Etapa</span>
                <span role="columnheader">5K</span>
                <span role="columnheader">10K</span>
              </div>
              @for (stage of allStages(); track stage.name) {
                <div
                  class="stage-row"
                  [class.current-stage]="currentStage().name === stage.name"
                  role="row"
                >
                  <span class="stage-name-cell" role="cell">
                    {{ stage.emoji }} {{ stage.name }}
                    <em class="stage-dates">{{ stage.dateRange }}</em>
                    @if (currentStage().name === stage.name) {
                      <span class="now-badge" aria-label="Etapa actual"
                        >AHORA</span
                      >
                    }
                  </span>
                  <span class="price-cell" role="cell">{{
                    formatPrice5k(stage)
                  }}</span>
                  <span class="price-cell" role="cell">{{
                    formatPrice10k(stage)
                  }}</span>
                </div>
              }
            </div>
            <p class="price-warning">
              ⚠️ Los precios suben con cada etapa. ¡Inscríbete hoy al mejor
              valor!
            </p>
          </div>

          <!-- Event info -->
          <div
            class="info-card glass-card"
            role="article"
            aria-label="Información del evento"
          >
            <h3 class="info-card-title">📅 Información del Evento</h3>
            <dl class="info-list">
              <div class="info-row">
                <dt>Fecha</dt>
                <dd>18 de Octubre, 2026 📅</dd>
              </div>
              <div class="info-row">
                <dt>Organiza</dt>
                <dd>Bosque Campista Tamaná</dd>
              </div>
              <div class="info-row">
                <dt>Modalidades</dt>
                <dd>5K Recreativa · 10K Competitiva</dd>
              </div>
              <div class="info-row">
                <dt>Municipio</dt>
                <dd>Santuario, Risaralda</dd>
              </div>
              <div class="info-row">
                <dt>Instagram</dt>
                <dd>
                  <a
                    href="https://www.instagram.com/santuariocorre5ky10k/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Santuario Corre (abre en nueva pestaña)"
                  >
                    &#64;santuariocorre5ky10k
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .registration-section {
        position: relative;
        overflow: hidden;
        background: linear-gradient(
          180deg,
          var(--color-bg-surface) 0%,
          var(--color-bg) 100%
        );
      }

      .glow-orb {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: radial-gradient(
          circle,
          rgba(45, 106, 79, 0.1) 0%,
          transparent 70%
        );
        pointer-events: none;
      }

      .reg-layout {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 4rem;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 3rem;
        }
      }

      /* ── Left column ── */
      .section-badge {
        display: inline-block;
        background: rgba(244, 162, 97, 0.12);
        border: 1px solid rgba(244, 162, 97, 0.3);
        border-radius: var(--radius-full);
        padding: 0.375rem 1.25rem;
        font-size: 0.85rem;
        color: var(--color-accent-light);
        font-weight: 600;
        margin-bottom: 1rem;
        letter-spacing: 0.08em;
      }

      .reg-title {
        font-size: var(--font-size-h2);
        font-weight: 900;
        color: var(--color-text-primary);
        margin: 0 0 1.25rem;
        line-height: var(--line-height-tight);
      }

      /* ── Stage banner ── */
      .stage-banner {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(45, 106, 79, 0.12);
        border: 1px solid rgba(45, 106, 79, 0.3);
        border-radius: var(--radius-md);
        padding: 0.875rem 1.25rem;
        margin-bottom: 1.25rem;
      }

      .stage-emoji {
        font-size: 1.5rem;
      }

      .stage-info {
        flex: 1;
        font-size: 0.9rem;
        color: var(--color-text-secondary);

        strong {
          color: var(--color-primary-light);
          font-weight: 700;
          margin-right: 0.25rem;
        }
        em {
          font-style: normal;
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }
      }

      .stage-badge {
        font-size: 0.75rem;
        font-weight: 700;
        background: var(--color-primary);
        color: white;
        padding: 0.25rem 0.625rem;
        border-radius: var(--radius-full);
        letter-spacing: 0.05em;
      }

      .reg-subtitle {
        font-size: 1.05rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
        margin: 0 0 1.75rem;

        strong {
          color: var(--color-text-primary);
        }
      }

      .price-highlight {
        color: var(--color-accent) !important;
        font-weight: 800;
      }

      /* ── Quick select chips ── */
      .quick-select {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1.75rem;
      }

      .quick-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        padding: 0.875rem 1.5rem;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all var(--transition-spring);
        font-family: var(--font-sans);

        &:hover {
          border-color: var(--color-primary-light);
          color: var(--color-text-primary);
          transform: translateY(-2px);
        }

        &.active {
          border-color: var(--color-accent);
          background: rgba(244, 162, 97, 0.1);
          color: var(--color-accent);
          box-shadow: 0 0 20px rgba(244, 162, 97, 0.2);
        }
      }

      .chip-icon {
        font-size: 1.25rem;
      }
      .chip-name {
        font-size: 0.9rem;
        font-weight: 600;
      }
      .chip-price {
        font-size: 0.75rem;
        font-weight: 700;
        opacity: 0.85;
      }

      /* ── Dual CTA ── */
      .dual-cta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.75rem;

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      .btn-form {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        padding: 1rem 1.5rem;
        background: var(--gradient-primary);
        color: white;
        font-weight: 700;
        font-size: 1rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        letter-spacing: 0.03em;
        box-shadow: var(--shadow-glow-green);
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal);
        text-align: center;

        &:hover {
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 0 50px rgba(45, 106, 79, 0.55);
        }
      }

      .btn-whatsapp {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        padding: 1rem 1.5rem;
        background: #25d366;
        color: white;
        font-weight: 700;
        font-size: 1rem;
        border: none;
        border-radius: var(--radius-full);
        font-family: var(--font-sans);
        cursor: pointer;
        letter-spacing: 0.03em;
        box-shadow: 0 0 20px rgba(37, 211, 102, 0.3);
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal);

        &:hover {
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 0 50px rgba(37, 211, 102, 0.5);
        }
      }

      /* ── Trust signals ── */
      .trust-signals {
        display: flex;
        gap: 1.25rem;
        flex-wrap: wrap;
      }

      .trust-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        color: var(--color-text-muted);
        font-weight: 500;
      }

      /* ── Right column ── */
      .reg-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .info-card {
        padding: 1.75rem;
      }

      .info-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 1.25rem;
      }

      /* ── Stages table ── */
      .stages-table {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .stages-header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 0 1rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .stage-row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 0 1rem;
        align-items: center;
        padding: 0.75rem 0.75rem;
        border-radius: var(--radius-sm);
        transition: background var(--transition-fast);

        &:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        &.current-stage {
          background: rgba(45, 106, 79, 0.12);
          border: 1px solid rgba(45, 106, 79, 0.25);
          border-radius: var(--radius-md);
        }
      }

      .stage-name-cell {
        font-size: 0.875rem;
        color: var(--color-text-primary);
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;

        em {
          font-style: normal;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-weight: 400;
        }
      }

      .now-badge {
        display: inline-block;
        margin-top: 0.15rem;
        font-size: 0.65rem;
        font-weight: 800;
        background: var(--color-accent);
        color: #0f1a14;
        padding: 0.1rem 0.4rem;
        border-radius: var(--radius-full);
        letter-spacing: 0.05em;
      }

      .price-cell {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--color-accent);
        white-space: nowrap;
      }

      .price-warning {
        font-size: 0.8rem;
        color: var(--color-accent-light);
        margin: 1rem 0 0;
        font-weight: 500;
        text-align: center;
      }

      /* ── Info DL ── */
      .info-list {
        margin: 0;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.625rem 0;
        border-bottom: 1px solid var(--color-border);

        &:last-child {
          border-bottom: none;
        }

        dt {
          font-size: 0.83rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        dd {
          font-size: 0.875rem;
          color: var(--color-text-primary);
          font-weight: 600;
          margin: 0;
          text-align: right;
          max-width: 65%;

          a {
            color: var(--color-primary-light);
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    `,
  ],
})
export class RegistrationComponent {
  protected store = inject(RaceStore);
  private platformId = inject(PLATFORM_ID);

  readonly formUrl = FORM_URL;
  readonly allStages = () => PRICE_STAGES;
  readonly currentStage = () => this.store.currentStage();

  formatPrice(n: number): string {
    return n.toLocaleString('es-CO');
  }

  formatPrice5k(stage: { price5k: number }): string {
    return '$' + stage.price5k.toLocaleString('es-CO');
  }

  formatPrice10k(stage: { price10k: number }): string {
    return '$' + stage.price10k.toLocaleString('es-CO');
  }

  chipPrice(id: string): string {
    const stage = this.store.currentStage();
    const price = id === '5k' ? stage.price5k : stage.price10k;
    return '$' + price.toLocaleString('es-CO') + ' COP';
  }

  openWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const modality = this.store.selectedModality();
    const price = this.store.selectedPriceLabel();
    const stage = this.store.currentStage();

    let msg: string;
    if (modality) {
      msg =
        '¡Hola! Quiero inscribirme en *Santuario Corre 5K & 10K 2026*' +
        ' – *' +
        modality.name +
        '* (' +
        modality.distance +
        ').\n' +
        'Etapa ' +
        stage.name +
        ': ' +
        price +
        '\n\n' +
        'Por favor indíquenme los pasos para completar mi inscripción. ¡Gracias! 🏃';
    } else {
      msg =
        '¡Hola! Quiero inscribirme en *Santuario Corre 5K & 10K 2026*.\n' +
        '¿Me pueden ayudar con el proceso de inscripción? ¡Gracias! 🏃';
    }

    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
}
