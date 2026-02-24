import { Component } from '@angular/core';

@Component({
  selector: 'app-historia',
  standalone: true,
  template: `
    <section
      id="historia"
      class="section-padding historia-section"
      aria-labelledby="historia-title"
    >
      <div class="section-container">
        <!-- Header -->
        <div class="section-header">
          <div class="section-badge">🌿 Nuestra Historia</div>
          <h2 id="historia-title" class="section-title">
            De jóvenes voluntarios<br />
            a <span class="text-gradient-primary">un evento de impacto</span>
          </h2>
        </div>

        <!-- Content grid -->
        <div class="historia-grid">
          <!-- Story text -->
          <div class="historia-text">
            <p class="historia-lead">
              <strong>"Santuario Corre 5K"</strong> nació como una iniciativa de
              jóvenes voluntarios del
              <strong>Bosque Campista Tamaná</strong> para fomentar estilos de
              vida saludables y potenciar el turismo en nuestro municipio.
            </p>
            <p class="historia-body">
              En nuestra primera edición el
              <strong>5 de octubre de 2025</strong>, logramos una participación
              equitativa de <strong>350 atletas</strong>
              (50.6% hombres y 49.4% mujeres), consolidándonos como un evento
              inclusivo y de alto impacto social.
            </p>
            <p class="historia-body">
              Este año evolucionamos. Mantenemos nuestro propósito de recaudar
              fondos para el <strong>liderazgo juvenil</strong>, pero elevamos
              el nivel deportivo con la nueva categoría de 10K competitiva.
            </p>

            <!-- Modalities description -->
            <div class="modality-desc-list">
              <div class="modality-desc glass-card">
                <div class="md-icon">🏃</div>
                <div>
                  <h3>5K Recreativa</h3>
                  <p>
                    Ideal para disfrutar en familia, con amigos y vivir la
                    cultura cafetera que caracteriza a nuestra región.
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

          <!-- Stats column -->
          <div class="historia-stats">
            <!-- Stat cards -->
            <div class="stat-card glass-card">
              <div class="stat-number">350</div>
              <div class="stat-label">Atletas en 2025</div>
              <div class="stat-detail">Primera edición</div>
            </div>

            <div class="stat-card glass-card">
              <div class="stat-number">50/50</div>
              <div class="stat-label">Equidad de género</div>
              <div class="stat-detail">50.6% H · 49.4% M</div>
            </div>

            <div class="stat-card glass-card accent-card">
              <div class="stat-number">2ª</div>
              <div class="stat-label">Edición 2026</div>
              <div class="stat-detail">¡Más grande que nunca!</div>
            </div>

            <!-- Organizer info -->
            <div class="organizer-card glass-card">
              <div class="org-header">
                <span class="org-icon">🏕️</span>
                <div>
                  <h4>Organiza</h4>
                  <p>Bosque Campista Tamaná</p>
                </div>
              </div>
              <p class="org-mission">
                Jóvenes voluntarios comprometidos con el bienestar, el turismo y
                el desarrollo comunitario de Santuario, Risaralda.
              </p>
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

      .section-header {
        text-align: center;
        margin-bottom: 3.5rem;
      }

      .section-badge {
        display: inline-block;
        background: rgba(45, 106, 79, 0.12);
        border: 1px solid rgba(45, 106, 79, 0.25);
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
        margin: 0;
        line-height: var(--line-height-tight);
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
        font-size: 1.15rem;
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

      /* ── Organizer ── */
      .organizer-card {
        padding: 1.5rem;
      }

      .org-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.875rem;
      }

      .org-icon {
        font-size: 2rem;
      }

      .org-header h4 {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 0.125rem;
      }

      .org-header p {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0;
      }

      .org-mission {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
      }
    `,
  ],
})
export class HistoriaComponent {}
