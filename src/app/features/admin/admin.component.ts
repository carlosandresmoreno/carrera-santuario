import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InscripcionService,
  InscripcionAdmin,
} from '../../core/services/inscripcion.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="admin-page">
      @if (!authenticated()) {
        <!-- Login -->
        <div class="login-wrapper">
          <div class="login-card glass-card">
            <h1 class="login-title">🔒 Panel de Administrador</h1>
            <p class="login-subtitle">Santuario Corre 5K & 10K 2026</p>
            <div class="login-form">
              <input
                type="password"
                [(ngModel)]="password"
                placeholder="Contraseña"
                class="login-input"
                (keyup.enter)="login()"
                aria-label="Contraseña de administrador"
              />
              @if (loginError()) {
                <span class="login-error">{{ loginError() }}</span>
              }
              <button
                class="login-btn"
                (click)="login()"
                [disabled]="loggingIn()"
              >
                @if (loggingIn()) {
                  ⏳ Verificando...
                } @else {
                  Ingresar
                }
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Admin Dashboard -->
        <div class="admin-dashboard section-container">
          <div class="admin-header">
            <div>
              <h1 class="admin-title">📊 Panel de Inscripciones</h1>
              <p class="admin-summary">
                Total: <strong>{{ inscripciones().length }}</strong> ·
                Aprobados: <strong>{{ countAprobados() }}</strong> · Pendientes:
                <strong>{{ inscripciones().length - countAprobados() }}</strong>
              </p>
            </div>
            <div class="admin-actions">
              <button
                class="export-btn"
                (click)="exportToExcel()"
                [disabled]="inscripciones().length === 0"
              >
                📁 Descargar Excel
              </button>
              <button
                class="refresh-btn"
                (click)="loadData()"
                [disabled]="loading()"
              >
                🔄 Actualizar
              </button>
              <a href="/" class="back-btn">← Volver al sitio</a>
            </div>
          </div>

          <!-- Filter -->
          <div class="filter-bar">
            <input
              type="text"
              [(ngModel)]="filterText"
              placeholder="Buscar por nombre o documento..."
              class="filter-input"
              aria-label="Filtrar inscripciones"
            />
            <select
              [(ngModel)]="filterStatus"
              class="filter-select"
              aria-label="Filtrar por estado"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
            </select>
          </div>

          <!-- Table -->
          <div class="table-wrapper">
            @if (loading()) {
              <div class="loading-state">⏳ Cargando inscripciones...</div>
            } @else if (filteredInscripciones().length === 0) {
              <div class="empty-state">No hay inscripciones que mostrar</div>
            } @else {
              <table class="admin-table" role="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Distancia</th>
                    <th>Talla</th>
                    <th>Género</th>
                    <th>EPS</th>
                    <th>Correo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (
                    ins of filteredInscripciones();
                    track ins._id;
                    let i = $index
                  ) {
                    <tr [class.row-approved]="ins.estadoPago === 'aprobado'">
                      <td>{{ i + 1 }}</td>
                      <td class="name-cell">
                        {{ ins.primerNombre }} {{ ins.segundoNombre || '' }}
                        {{ ins.primerApellido }} {{ ins.segundoApellido }}
                      </td>
                      <td>{{ ins.tipoDocumento }} {{ ins.numeroDocumento }}</td>
                      <td>
                        <span
                          class="distance-badge"
                          [class.dist-10k]="ins.distancia === '10k'"
                        >
                          {{ ins.distancia === '10k' ? '10K' : '5K' }}
                        </span>
                      </td>
                      <td>{{ ins.tallaCamiseta }}</td>
                      <td>{{ ins.genero }}</td>
                      <td>{{ ins.eps }}</td>
                      <td class="email-cell">{{ ins.correo }}</td>
                      <td>{{ formatDate(ins.fechaInscripcion) }}</td>
                      <td>
                        @if (ins.estadoPago === 'aprobado') {
                          <span class="status-badge approved">✅ Aprobado</span>
                        } @else {
                          <span class="status-badge pending">⏳ Pendiente</span>
                        }
                      </td>
                      <td>
                        @if (ins.estadoPago !== 'aprobado') {
                          <button
                            class="approve-btn"
                            (click)="aprobarPago(ins._id)"
                            [disabled]="approvingId() === ins._id"
                          >
                            @if (approvingId() === ins._id) {
                              ⏳
                            } @else {
                              ✅ Aprobar
                            }
                          </button>
                        }

                        <button
                          class="delete-btn"
                          (click)="
                            eliminarInscripcion(
                              ins._id,
                              ins.primerNombre + ' ' + ins.primerApellido
                            )
                          "
                          [disabled]="deletingId() === ins._id"
                          title="Eliminar inscripción"
                        >
                          @if (deletingId() === ins._id) {
                            ⏳
                          } @else {
                            🗑️
                          }
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .admin-page {
        min-height: 100vh;
        background: var(--color-bg);
        color: var(--color-text-primary);
      }

      /* ── Login ── */
      .login-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 2.5rem;
        text-align: center;
      }

      .login-title {
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0 0 0.5rem;
      }

      .login-subtitle {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin: 0 0 2rem;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .login-input {
        padding: 0.875rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        font-size: 1rem;
        font-family: var(--font-sans);
        text-align: center;

        &:focus {
          outline: none;
          border-color: var(--color-primary-light);
        }
      }

      .login-error {
        font-size: 0.8rem;
        color: #ef4444;
        font-weight: 500;
      }

      .login-btn {
        padding: 0.875rem;
        background: var(--gradient-primary);
        color: white;
        font-weight: 700;
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        font-family: var(--font-sans);
        font-size: 1rem;
        transition: all var(--transition-spring);

        &:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: var(--shadow-glow-green);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      /* ── Dashboard ── */
      .admin-dashboard {
        padding: 2rem 1rem;
        max-width: 1400px;
      }

      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .admin-title {
        font-size: 1.75rem;
        font-weight: 900;
        margin: 0 0 0.25rem;
      }

      .admin-summary {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin: 0;
        strong {
          color: var(--color-accent);
        }
      }

      .admin-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .export-btn {
        padding: 0.625rem 1.25rem;
        background: rgba(244, 162, 97, 0.15);
        border: 1px solid rgba(244, 162, 97, 0.3);
        color: var(--color-accent);
        border-radius: var(--radius-full);
        font-weight: 600;
        font-size: 0.85rem;
        font-family: var(--font-sans);
        cursor: pointer;
        transition: all var(--transition-micro);

        &:hover:not(:disabled) {
          background: rgba(244, 162, 97, 0.25);
          transform: scale(1.02);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .refresh-btn {
        padding: 0.625rem 1.25rem;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-weight: 600;
        font-size: 0.85rem;
        font-family: var(--font-sans);
        cursor: pointer;

        &:disabled {
          opacity: 0.6;
        }
      }

      .back-btn {
        padding: 0.625rem 1.25rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all var(--transition-micro);

        &:hover {
          border-color: var(--color-text-muted);
          color: var(--color-text-primary);
        }
      }

      /* ── Filter ── */
      .filter-bar {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.5rem;

        @media (max-width: 600px) {
          flex-direction: column;
        }
      }

      .filter-input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        font-size: 0.9rem;
        font-family: var(--font-sans);

        &:focus {
          outline: none;
          border-color: var(--color-primary-light);
        }

        &::placeholder {
          color: var(--color-text-muted);
        }
      }

      .filter-select {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        font-size: 0.9rem;
        font-family: var(--font-sans);
        cursor: pointer;
      }

      /* ── Table ── */
      .table-wrapper {
        overflow-x: auto;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }

      .loading-state,
      .empty-state {
        padding: 3rem;
        text-align: center;
        color: var(--color-text-muted);
        font-size: 1rem;
      }

      .admin-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.82rem;

        th {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 0.625rem;
          text-align: left;
          font-weight: 700;
          color: var(--color-text-secondary);
          white-space: nowrap;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          padding: 0.75rem 0.625rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: var(--color-text-primary);
          vertical-align: middle;
        }

        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .row-approved td {
          opacity: 0.7;
        }
      }

      .name-cell {
        font-weight: 600;
        white-space: nowrap;
      }

      .email-cell {
        font-size: 0.78rem;
        color: var(--color-text-muted);
      }

      .distance-badge {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-full);
        font-weight: 700;
        font-size: 0.7rem;
        background: var(--gradient-primary);
        color: white;

        &.dist-10k {
          background: var(--gradient-accent);
        }
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.625rem;
        border-radius: var(--radius-full);
        font-size: 0.72rem;
        font-weight: 700;
        white-space: nowrap;

        &.approved {
          background: rgba(45, 106, 79, 0.15);
          color: var(--color-primary-light);
        }

        &.pending {
          background: rgba(244, 162, 97, 0.15);
          color: var(--color-accent);
        }
      }

      .approve-btn {
        padding: 0.375rem 0.75rem;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        font-family: var(--font-sans);
        white-space: nowrap;
        transition: all var(--transition-micro);

        &:disabled {
          opacity: 0.5;
        }
      }

      .delete-btn {
        padding: 0.375rem 0.5rem;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: var(--radius-md);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all var(--transition-micro);
        margin-left: 0.5rem;

        &:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.5;
        }
      }

      .done-text {
        color: var(--color-text-muted);
        font-size: 0.85rem;
      }
    `,
  ],
})
export class AdminComponent {
  private readonly service = inject(InscripcionService);

  password = '';
  filterText = '';
  filterStatus = 'todos';

  readonly authenticated = signal(false);
  readonly loggingIn = signal(false);
  readonly loginError = signal('');
  readonly loading = signal(false);
  readonly inscripciones = signal<InscripcionAdmin[]>([]);
  readonly approvingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  login(): void {
    if (!this.password.trim()) return;

    this.loggingIn.set(true);
    this.loginError.set('');

    this.service.listarTodas(this.password).subscribe({
      next: (data) => {
        this.loggingIn.set(false);
        this.authenticated.set(true);
        this.inscripciones.set(data);
      },
      error: () => {
        this.loggingIn.set(false);
        this.loginError.set('Contraseña incorrecta');
      },
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.service.listarTodas(this.password).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.inscripciones.set(data);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filteredInscripciones(): InscripcionAdmin[] {
    let list = this.inscripciones();

    if (this.filterStatus !== 'todos') {
      list = list.filter((i) => i.estadoPago === this.filterStatus);
    }

    const q = this.filterText.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (i) =>
          i.primerNombre.toLowerCase().includes(q) ||
          i.primerApellido.toLowerCase().includes(q) ||
          i.numeroDocumento.includes(q),
      );
    }

    return list;
  }

  countAprobados(): number {
    return this.inscripciones().filter((i) => i.estadoPago === 'aprobado')
      .length;
  }

  aprobarPago(id: string): void {
    this.approvingId.set(id);
    this.service.aprobarPago(id, this.password).subscribe({
      next: () => {
        this.approvingId.set(null);
        // Update local state
        this.inscripciones.update((list) =>
          list.map((i) =>
            i._id === id ? { ...i, estadoPago: 'aprobado' } : i,
          ),
        );
      },
      error: () => {
        this.approvingId.set(null);
      },
    });
  }

  eliminarInscripcion(id: string, nombre: string): void {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar la inscripción de ${nombre}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    this.deletingId.set(id);
    this.service.eliminar(id, this.password).subscribe({
      next: () => {
        this.deletingId.set(null);
        // Update local state
        this.inscripciones.update((list) => list.filter((i) => i._id !== id));
      },
      error: (err) => {
        this.deletingId.set(null);
        alert('Error al eliminar: ' + (err.error?.error || 'Intenta de nuevo'));
      },
    });
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return iso;
    }
  }

  exportToExcel(): void {
    const data = this.filteredInscripciones();
    if (data.length === 0) return;

    const headers = [
      'Primer Nombre',
      'Segundo Nombre',
      'Primer Apellido',
      'Segundo Apellido',
      'Correo',
      'Tipo Doc',
      'Num Doc',
      'Fecha Nacimiento',
      'Género',
      'EPS',
      'Contacto Emergencia',
      'Talla Camiseta',
      'Distancia',
      'Estado Pago',
      'Fecha Inscripción',
    ];

    const escape = (v: string) => {
      if (v.includes(',') || v.includes('"') || v.includes('\n')) {
        return '"' + v.replace(/"/g, '""') + '"';
      }
      return v;
    };

    const rows = data.map((i) =>
      [
        i.primerNombre,
        i.segundoNombre || '',
        i.primerApellido,
        i.segundoApellido,
        i.correo,
        i.tipoDocumento,
        i.numeroDocumento,
        i.fechaNacimiento,
        i.genero,
        i.eps,
        i.contactoEmergencia,
        i.tallaCamiseta,
        i.distancia === '10k' ? '10K' : '5K',
        i.estadoPago === 'aprobado' ? 'Aprobado' : 'Pendiente',
        this.formatDate(i.fechaInscripcion),
      ]
        .map(escape)
        .join(','),
    );

    const csv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscripciones_santuario_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
