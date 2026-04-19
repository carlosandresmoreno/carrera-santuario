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
            <h1 class="login-title">Panel de Administrador</h1>
            <p class="login-subtitle">Santuario Corre 5K & 10K 2026</p>
            <div class="login-form">
              <input
                type="password"
                [(ngModel)]="password"
                placeholder="Contrasena"
                class="login-input"
                (keyup.enter)="login()"
                aria-label="Contrasena de administrador"
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
                  Verificando...
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
              <h1 class="admin-title">Panel de Inscripciones</h1>
              <p class="admin-summary">
                Total: <strong>{{ inscripciones().length }}</strong> -
                Aprobados: <strong>{{ countAprobados() }}</strong> - Pendientes:
                <strong>{{ inscripciones().length - countAprobados() }}</strong>
              </p>
            </div>
            <div class="admin-actions">
              <button
                class="export-btn"
                (click)="exportToExcel()"
                [disabled]="inscripciones().length === 0"
              >
                Descargar Excel
              </button>
              <button
                class="refresh-btn"
                (click)="loadData()"
                [disabled]="loading()"
              >
                Actualizar
              </button>
              <a href="/" class="back-btn">Volver al sitio</a>
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

          <!-- Table Content -->
          <div class="table-wrapper">
            @if (loading()) {
              <div class="loading-state">Cargando inscripciones...</div>
            } @else if (filteredInscripciones().length === 0) {
              <div class="empty-state">No hay inscripciones que mostrar</div>
            } @else {
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Telefono</th>
                    <th>Ciudad</th>
                    <th>Distancia</th>
                    <th>Talla</th>
                    <th>Genero</th>
                    <th>EPS</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Accion</th>
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
                      <td>{{ ins.telefono }}</td>
                      <td>{{ ins.ciudad }}</td>
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
                      <td>
                        <div class="action-badges">
                          <span
                            class="status-badge"
                            [class.approved]="ins.estadoPago === 'aprobado'"
                            [class.pending]="ins.estadoPago !== 'aprobado'"
                          >
                            {{
                              ins.estadoPago === 'aprobado'
                                ? 'Aprobado'
                                : 'Pendiente'
                            }}
                          </span>
                          @if (ins.codigoDescuento) {
                            <span class="status-badge discount"
                              >Desc: {{ ins.codigoDescuento }}</span
                            >
                          }
                        </div>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button
                            class="edit-btn"
                            (click)="startEdit(ins)"
                            title="Editar"
                          >
                            Edit
                          </button>

                          @if (ins.estadoPago !== 'aprobado') {
                            <button
                              class="approve-btn"
                              (click)="aprobarPago(ins._id)"
                              [disabled]="approvingId() === ins._id"
                            >
                              {{
                                approvingId() === ins._id
                                  ? 'Wait...'
                                  : 'Aprobar'
                              }}
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
                            title="Eliminar"
                          >
                            {{ deletingId() === ins._id ? 'Wait' : 'Del' }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>

          <!-- Edit Modal -->
          @if (editingInscripcion()) {
            <div class="modal-backdrop" (click)="cancelEdit()">
              <div
                class="modal-container glass-card"
                (click)="$event.stopPropagation()"
              >
                <div class="modal-header">
                  <h2 class="modal-title">Editar Inscripcion</h2>
                  <p class="modal-subtitle">Modificando datos del atleta</p>
                </div>

                <div class="edit-grid">
                  <div class="edit-group">
                    <label>Primer Nombre</label>
                    <input [(ngModel)]="editBuffer.primerNombre" />
                  </div>
                  <div class="edit-group">
                    <label>Primer Apellido</label>
                    <input [(ngModel)]="editBuffer.primerApellido" />
                  </div>
                  <div class="edit-group">
                    <label>Num Doc</label>
                    <input [(ngModel)]="editBuffer.numeroDocumento" />
                  </div>
                  <div class="edit-group">
                    <label>Telefono</label>
                    <input [(ngModel)]="editBuffer.telefono" />
                  </div>
                  <div class="edit-group">
                    <label>Ciudad</label>
                    <input [(ngModel)]="editBuffer.ciudad" />
                  </div>
                  <div class="edit-group">
                    <label>EPS</label>
                    <input [(ngModel)]="editBuffer.eps" />
                  </div>
                  <div class="edit-group">
                    <label>Talla</label>
                    <select [(ngModel)]="editBuffer.tallaCamiseta">
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <div class="edit-group">
                    <label>Distancia</label>
                    <select [(ngModel)]="editBuffer.distancia">
                      <option value="5k">5K</option>
                      <option value="10k">10K</option>
                    </select>
                  </div>
                </div>

                <div class="modal-actions">
                  <button class="cancel-btn" (click)="cancelEdit()">
                    Cancelar
                  </button>
                  <button
                    class="save-btn"
                    (click)="saveEdit()"
                    [disabled]="savingEdit()"
                  >
                    {{ savingEdit() ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </div>
            </div>
          }
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

      /* Login */
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
        text-align: center;
      }
      .login-btn {
        padding: 0.875rem;
        background: var(--gradient-primary);
        color: white;
        font-weight: 700;
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        font-size: 1rem;
      }
      .login-error {
        font-size: 0.8rem;
        color: #ef4444;
      }

      /* Dashboard */
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
        margin: 0;
      }
      .admin-summary {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
      .admin-actions {
        display: flex;
        gap: 0.75rem;
      }
      .export-btn,
      .refresh-btn,
      .back-btn {
        padding: 0.625rem 1.25rem;
        border-radius: var(--radius-full);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        text-decoration: none;
      }
      .export-btn {
        background: rgba(244, 162, 97, 0.15);
        border: 1px solid rgba(244, 162, 97, 0.3);
        color: var(--color-accent);
      }
      .refresh-btn {
        background: var(--gradient-primary);
        color: white;
        border: none;
      }
      .back-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
      }

      /* Filters */
      .filter-bar {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      .filter-input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
      }
      .filter-select {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
      }

      /* Table */
      .table-wrapper {
        overflow-x: auto;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.02);
      }
      .admin-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.85rem;
      }
      .admin-table th {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        text-align: left;
        color: var(--color-text-secondary);
        border-bottom: 1px solid var(--color-border);
      }
      .admin-table td {
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      }
      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
      }
      .status-badge.approved {
        background: rgba(45, 106, 79, 0.2);
        color: #4ade80;
      }
      .status-badge.pending {
        background: rgba(244, 162, 97, 0.2);
        color: #f4a261;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }
      .edit-btn,
      .approve-btn,
      .delete-btn {
        padding: 0.4rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
      }
      .edit-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid var(--color-border);
      }
      .approve-btn {
        background: #2d6a4f;
        color: white;
        border: none;
      }
      .delete-btn {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      /* Modal */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .modal-container {
        width: 100%;
        max-width: 600px;
        padding: 2rem;
        border: 1px solid var(--color-border);
      }
      .edit-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin: 2rem 0;
      }
      .edit-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .edit-group label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--color-text-muted);
      }
      .edit-group input,
      .edit-group select {
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: white;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
      .save-btn {
        padding: 0.75rem 1.5rem;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-weight: 700;
        cursor: pointer;
      }
      .cancel-btn {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        border-radius: var(--radius-full);
        cursor: pointer;
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

  readonly editingInscripcion = signal<InscripcionAdmin | null>(null);
  readonly savingEdit = signal(false);
  editBuffer: Partial<InscripcionAdmin> = {};

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
        this.loginError.set('Password incorrecto');
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
        this.inscripciones.update((list) =>
          list.map((i) =>
            i._id === id ? { ...i, estadoPago: 'aprobado' } : i,
          ),
        );
      },
      error: () => this.approvingId.set(null),
    });
  }

  eliminarInscripcion(id: string, nombre: string): void {
    if (!confirm('Esta seguro de eliminar la inscripcion de ' + nombre + '?'))
      return;
    this.deletingId.set(id);
    this.service.eliminar(id, this.password).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.inscripciones.update((list) => list.filter((i) => i._id !== id));
      },
      error: () => this.deletingId.set(null),
    });
  }

  startEdit(ins: InscripcionAdmin): void {
    this.editingInscripcion.set(ins);
    this.editBuffer = { ...ins };
  }

  cancelEdit(): void {
    this.editingInscripcion.set(null);
    this.editBuffer = {};
  }

  saveEdit(): void {
    const ins = this.editingInscripcion();
    if (!ins) return;
    this.savingEdit.set(true);
    this.service.actualizar(ins._id, this.editBuffer, this.password).subscribe({
      next: () => {
        this.savingEdit.set(false);
        this.editingInscripcion.set(null);
        this.inscripciones.update((list) =>
          list.map((item) =>
            item._id === ins._id ? { ...item, ...this.editBuffer } : item,
          ),
        );
      },
      error: () => {
        this.savingEdit.set(false);
        alert('Error al guardar cambios');
      },
    });
  }

  exportToExcel(): void {
    const data = this.filteredInscripciones();
    if (data.length === 0) return;

    const headers = [
      'Nombre',
      'Apellido',
      'Correo',
      'Tipo Doc',
      'Num Doc',
      'Telefono',
      'Ciudad',
      'Talla',
      'Distancia',
      'Estado',
    ];
    const rows = data.map((i) => [
      i.primerNombre,
      i.primerApellido,
      i.correo,
      i.tipoDocumento,
      i.numeroDocumento,
      i.telefono,
      i.ciudad,
      i.tallaCamiseta,
      i.distancia,
      i.estadoPago,
    ]);

    const csvContent =
      '\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inscripciones.csv';
    link.click();
  }
}
