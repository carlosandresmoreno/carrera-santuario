import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InscripcionService,
  InscripcionStatus,
} from '../../core/services/inscripcion.service';

@Component({
  selector: 'app-status-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section
      id="consulta"
      class="section-padding status-section"
      aria-labelledby="status-title"
    >
      <div class="section-container">
        <div class="section-header">
          <div class="section-badge">🔍 Consulta tu Estado</div>
          <h2 id="status-title" class="section-title">
            ¿Ya te inscribiste?
            <span class="text-gradient-accent">Verifica tu estado</span>
          </h2>
          <p class="section-subtitle">
            Ingresa tu número de documento para consultar el estado de tu
            inscripción y pago.
          </p>
        </div>

        <div class="status-card glass-card">
          <!-- Search form -->
          <div class="search-form">
            <input
              type="text"
              [(ngModel)]="cedula"
              placeholder="Número de documento"
              class="search-input"
              (keyup.enter)="buscar()"
              aria-label="Número de documento para consulta"
            />
            <button
              class="search-btn"
              (click)="buscar()"
              [disabled]="loading()"
              aria-label="Consultar estado de inscripción"
            >
              @if (loading()) {
                ⏳ Buscando...
              } @else {
                🔍 Consultar
              }
            </button>
          </div>

          <!-- Result -->
          @if (result()) {
            <div
              class="result-card"
              [class.pago-aprobado]="result()!.estadoPago === 'aprobado'"
            >
              <div class="result-header">
                @if (result()!.estadoPago === 'aprobado') {
                  <span class="result-icon">✅</span>
                  <span class="result-status approved">Pago Aprobado</span>
                } @else {
                  <span class="result-icon">⏳</span>
                  <span class="result-status pending">Pago Pendiente</span>
                }
              </div>
              <div class="result-details">
                <div class="detail-row">
                  <span class="detail-label">Nombre</span>
                  <span class="detail-value">{{ result()!.nombre }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Distancia</span>
                  <span class="detail-value">{{
                    result()!.distancia === '10k'
                      ? '10K Competitiva'
                      : '5K Recreativa'
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Talla</span>
                  <span class="detail-value">{{
                    result()!.tallaCamiseta
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Inscrito el</span>
                  <span class="detail-value">{{
                    formatDate(result()!.fechaInscripcion)
                  }}</span>
                </div>
              </div>

              @if (result()!.estadoPago !== 'aprobado') {
                <div class="pending-action">
                  <p>
                    📱 Realiza el pago y envía comprobante al WhatsApp:<br />
                    <strong>311 622 7064</strong>
                  </p>
                  <div class="payment-qr">
                    <p class="qr-label">Puedes pagar escaneando este QR:</p>
                    <div class="qr-container">
                      <img
                        src="/assets/paPagar.png"
                        alt="QR de pago"
                        class="qr-img"
                      />
                      <p class="qr-hint">
                        Bancolombia / Nequi / Ahorro a la mano
                      </p>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Error -->
          @if (errorMsg()) {
            <div class="alert-error">
              {{ errorMsg() }}
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .status-section {
        position: relative;
        overflow: hidden;
      }

      .status-card {
        max-width: 560px;
        margin: 0 auto;
        padding: 2rem;
      }

      .search-form {
        display: flex;
        gap: 0.75rem;

        @media (max-width: 500px) {
          flex-direction: column;
        }
      }

      .search-input {
        flex: 1;
        padding: 0.875rem 1rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(37, 99, 235, 0.2);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        font-size: 1rem;
        font-family: var(--font-sans);
        transition: border-color var(--transition-fast);
        box-shadow: var(--shadow-soft);

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        &::placeholder {
          color: var(--color-text-muted);
        }
      }

      .search-btn {
        padding: 0.875rem 1.5rem;
        background: #2563eb;
        color: white;
        font-weight: 700;
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        font-family: var(--font-sans);
        font-size: 0.95rem;
        white-space: nowrap;
        transition: all var(--transition-spring);
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);

        &:hover:not(:disabled) {
          background: #1d4ed8;
          transform: scale(1.03);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      /* ── Result ── */
      .result-card {
        margin-top: 1.5rem;
        padding: 1.5rem;
        border: 1px solid rgba(37, 99, 235, 0.15);
        border-radius: var(--radius-md);
        background: white;
        box-shadow: var(--shadow-card);

        &.pago-aprobado {
          border-color: rgba(37, 99, 235, 0.3);
          background: rgba(37, 99, 235, 0.03);
        }
      }

      .result-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
      }

      .result-icon {
        font-size: 1.5rem;
      }

      .result-status {
        font-size: 1.1rem;
        font-weight: 800;

        &.approved {
          color: var(--color-primary-light);
        }

        &.pending {
          color: var(--color-accent);
        }
      }

      .result-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .detail-label {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        font-weight: 500;
      }

      .detail-value {
        font-size: 0.9rem;
        color: var(--color-text-primary);
        font-weight: 600;
      }

      .pending-action {
        margin-top: 1.25rem;
        padding: 1rem;
        background: rgba(250, 204, 21, 0.05);
        border: 1px solid rgba(250, 204, 21, 0.2);
        border-radius: var(--radius-md);

        p {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin: 0 0 1rem;
          line-height: 1.7;
          strong {
            color: var(--color-primary);
          }
        }
      }

      .payment-qr {
        text-align: center;
        border-top: 1px solid var(--color-border);
        padding-top: 1rem;
      }

      .qr-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 0.75rem;
      }

      .qr-container {
        background: white;
        padding: 0.75rem;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-soft);
      }

      .qr-img {
        width: 160px;
        height: 160px;
        object-fit: contain;
      }

      .qr-hint {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 600;
        margin: 0;
      }

      .alert-error {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-md);
        color: #fca5a5;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class StatusCheckComponent {
  private readonly service = inject(InscripcionService);

  cedula = '';
  readonly loading = signal(false);
  readonly result = signal<InscripcionStatus | null>(null);
  readonly errorMsg = signal('');

  buscar(): void {
    const doc = this.cedula.trim();
    if (!doc) return;

    this.loading.set(true);
    this.result.set(null);
    this.errorMsg.set('');

    this.service.consultarEstado(doc).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.result.set(data);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.error?.error || 'No se encontró inscripción con ese documento',
        );
      },
    });
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  }
}
