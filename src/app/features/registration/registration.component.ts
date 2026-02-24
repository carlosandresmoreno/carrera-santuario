import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RaceStore, PRICE_STAGES } from '../../store/race.store';

const WHATSAPP_NUMBER = '573107333078';
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeeo5UXa64vaFIqhxt0NFxYf-jCCTHa7I4c08sbFw8zFTJFyw/viewform?usp=header';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <section id="inscripcion" class="section-padding registration-section" aria-labelledby="reg-title">
      <div class="reg-layout section-container">

        <!-- Glow orb -->
        <div class="glow-orb" aria-hidden="true"></div>

        <!-- Left: Main CTA -->
        <div class="reg-content">

          <div class="section-badge">🚀 ¡Cupos limitados!</div>

          <h2 id="reg-title" class="reg-title">
            ¿Listo para
            <span class="text-gradient-accent">correr?</span>
          </h2>

          <!-- Current stage banner -->
          <div class="stage-banner" role="status" aria-label="Etapa de precios actual">
            <span class="stage-emoji">{{ currentStage().emoji }}</span>
            <span class="stage-info">
              Etapa <strong>{{ currentStage().name }}</strong>
              <em>{{ currentStage().dateRange }}</em>
            </span>
            <span class="stage-badge">Precio actual</span>
          </div>

          <p class="reg-subtitle">
            @if (store.hasSelection()) {
              ¡Perfecto! Inscríbete en la
              <strong>{{ store.selectedModality()?.name }}</strong> por
              <strong class="price-highlight">{{ store.selectedPriceLabel() }}</strong>.
              Usa el formulario oficial o escríbenos por WhatsApp.
            } @else {
              Selecciona tu modalidad y completa tu inscripción mediante
              el formulario oficial o nuestro WhatsApp.
            }
          </p>

          <!-- Modality quick select -->
          <div class="quick-select" role="group" aria-label="Selección de modalidad">
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

          <!-- Primary CTA: Google Forms -->
          <a
            [href]="formUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-form"
            [attr.aria-label]="store.hasSelection()
              ? 'Inscribirme en ' + store.selectedModality()?.name + ' – Formulario oficial'
              : 'Ir al formulario de inscripción oficial'"
          >
            📋 Formulario de Inscripción Oficial
          </a>

          <!-- Secondary CTA: WhatsApp -->
          <button
            mat-stroked-button
            class="whatsapp-btn"
            (click)="openWhatsApp()"
            aria-label="Resolver dudas o inscribirse vía WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Dudas por WhatsApp
          </button>

          <!-- Trust signals -->
          <div class="trust-signals" role="list" aria-label="Garantías">
            <div class="trust-item" role="listitem"><span aria-hidden="true">🔒</span><span>Inscripción segura</span></div>
            <div class="trust-item" role="listitem"><span aria-hidden="true">⚡</span><span>Confirmación inmediata</span></div>
            <div class="trust-item" role="listitem"><span aria-hidden="true">🌿</span><span>Evento inclusivo y social</span></div>
          </div>

        </div>

        <!-- Right: Info cards -->
        <div class="reg-info">

          <!-- Price stages table -->
          <div class="info-card glass-card" role="article" aria-label="Tabla de precios por etapa">
            <h3 class="info-card-title">💰 Precios por Etapa</h3>
            <div class="stages-table" role="table" aria-label="Precios por etapa de inscripción">
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
                      <span class="now-badge" aria-label="Etapa actual">AHORA</span>
                    }
                  </span>
                  <span class="price-cell" role="cell">{{ formatPrice5k(stage) }}</span>
                  <span class="price-cell" role="cell">{{ formatPrice10k(stage) }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Event info -->
          <div class="info-card glass-card" role="article" aria-label="Información del evento">
            <h3 class="info-card-title">📅 Información del Evento</h3>
            <dl class="info-list">
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
                <dd>Santuario, Risaralda 🌿</dd>
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
  styles: [`
    .registration-section {
      position: relative;
      overflow: hidden;
      background: linear-gradient(180deg, var(--color-bg-surface) 0%, var(--color-bg) 100%);
    }

    .glow-orb {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(45,106,79,0.1) 0%, transparent 70%);
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
      background: rgba(244,162,97,0.12);
      border: 1px solid rgba(244,162,97,0.3);
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
      background: rgba(45,106,79,0.12);
      border: 1px solid rgba(45,106,79,0.3);
      border-radius: var(--radius-md);
      padding: 0.875rem 1.25rem;
      margin-bottom: 1.25rem;
    }

    .stage-emoji { font-size: 1.5rem; }

    .stage-info {
      flex: 1;
      font-size: 0.9rem;
      color: var(--color-text-secondary);

      strong { color: var(--color-primary-light); font-weight: 700; margin-right: 0.25rem; }
      em { font-style: normal; color: var(--color-text-muted); font-size: 0.8rem; }
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
      font-size: 1rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0 0 1.75rem;

      strong { color: var(--color-text-primary); }
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
        background: rgba(244,162,97,0.1);
        color: var(--color-accent);
        box-shadow: 0 0 20px rgba(244,162,97,0.2);
      }
    }

    .chip-icon { font-size: 1.25rem; }
    .chip-name { font-size: 0.9rem; font-weight: 600; }
    .chip-price { font-size: 0.75rem; font-weight: 700; opacity: 0.85; }

    /* ── Form button (primary) ── */
    .btn-form {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      width: 100%;
      padding: 1rem 2rem;
      background: var(--gradient-primary);
      color: white;
      font-weight: 700;
      font-size: 1.05rem;
      border-radius: var(--radius-full);
      text-decoration: none;
      letter-spacing: 0.03em;
      box-shadow: var(--shadow-glow-green);
      transition: transform var(--transition-spring), box-shadow var(--transition-normal);
      margin-bottom: 1rem;

      &:hover {
        transform: scale(1.03) translateY(-2px);
        box-shadow: 0 0 50px rgba(45,106,79,0.55);
      }
    }

    /* ── WhatsApp button (secondary) ── */
    .whatsapp-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.625rem !important;
      width: 100%;
      height: 3rem !important;
      border: 2px solid #25D366 !important;
      color: #25D366 !important;
      font-weight: 600 !important;
      font-size: 0.95rem !important;
      border-radius: var(--radius-full) !important;
      font-family: var(--font-sans) !important;
      transition: background var(--transition-normal), color var(--transition-normal) !important;
      margin-bottom: 1.5rem;

      &:hover {
        background: rgba(37,211,102,0.1) !important;
      }
    }

    /* ── Trust signals ── */
    .trust-signals {
      display: flex;
      gap: 1.5rem;
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

      &:hover { background: rgba(255,255,255,0.03); }

      &.current-stage {
        background: rgba(45,106,79,0.12);
        border: 1px solid rgba(45,106,79,0.25);
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
      color: #0F1A14;
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

    /* ── Info DL ── */
    .info-list { margin: 0; }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.625rem 0;
      border-bottom: 1px solid var(--color-border);

      &:last-child { border-bottom: none; }

      dt { font-size: 0.83rem; color: var(--color-text-muted); font-weight: 500; }
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
          &:hover { text-decoration: underline; }
        }
      }
    }
  `],
})
export class RegistrationComponent {
  protected store    = inject(RaceStore);
  private platformId = inject(PLATFORM_ID);

  readonly formUrl     = FORM_URL;
  readonly allStages   = () => PRICE_STAGES;
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
    const price    = this.store.selectedPriceLabel();
    const stage    = this.store.currentStage();

    let msg: string;
    if (modality) {
      msg = '\u00a1Hola! Quiero inscribirme en *Santuario Corre 5K & 10K 2026*'
          + ' \u2013 *' + modality.name + '* (' + modality.distance + ').\n'
          + 'Etapa ' + stage.name + ': ' + price + '\n\n'
          + 'Por favor ind\u00edquenme los pasos para completar mi inscripci\u00f3n. \u00a1Gracias! \uD83C\uDFC3';
    } else {
      msg = '\u00a1Hola! Me interesa inscribirme en *Santuario Corre 5K & 10K 2026*.\n'
          + '\u00bfPueden darme informaci\u00f3n sobre las modalidades y precios? \u00a1Gracias!';
    }

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
}
