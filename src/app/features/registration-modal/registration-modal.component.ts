import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InscripcionService } from '../../core/services/inscripcion.service';

interface ModalData {
  distancia: string | null;
}

@Component({
  selector: 'app-registration-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div
        class="modal-container glass-card"
        (click)="$event.stopPropagation()"
      >
        <!-- Close button -->
        <button class="close-btn" (click)="close()" aria-label="Cerrar">
          ✕
        </button>

        @if (!success()) {
          <!-- Form Header -->
          <div class="modal-header">
            <h2 class="modal-title">📋 Formulario de Inscripción</h2>
            <p class="modal-subtitle">
              Completa tus datos para inscribirte en
              <strong>Santuario Corre 5K & 10K 2026</strong>
            </p>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-form">
            <!-- Distancia -->
            <div class="form-group">
              <label>Distancia *</label>
              <div class="distance-selector">
                <label
                  class="distance-option"
                  [class.selected]="form.get('distancia')?.value === '5k'"
                >
                  <input type="radio" formControlName="distancia" value="5k" />
                  <span class="dist-label">🏃 5K Recreativa</span>
                </label>
                <label
                  class="distance-option"
                  [class.selected]="form.get('distancia')?.value === '10k'"
                >
                  <input type="radio" formControlName="distancia" value="10k" />
                  <span class="dist-label">🏆 10K Competitiva</span>
                </label>
              </div>
            </div>

            <!-- Correo -->
            <div class="form-group">
              <label for="correo">Correo electrónico *</label>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                placeholder="tu@correo.com"
                autocomplete="email"
              />
              @if (
                form.get('correo')?.touched &&
                form.get('correo')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
              @if (
                form.get('correo')?.touched &&
                form.get('correo')?.hasError('email')
              ) {
                <span class="error"
                  >Ingresa un correo válido (ej: tu&#64;correo.com)</span
                >
              }
            </div>

            <!-- Nombres -->
            <div class="form-row">
              <div class="form-group">
                <label for="primerNombre">Primer nombre *</label>
                <input
                  id="primerNombre"
                  type="text"
                  formControlName="primerNombre"
                  autocomplete="given-name"
                />
                @if (
                  form.get('primerNombre')?.touched &&
                  form.get('primerNombre')?.hasError('required')
                ) {
                  <span class="error">Campo obligatorio</span>
                }
                @if (
                  form.get('primerNombre')?.touched &&
                  form.get('primerNombre')?.hasError('minlength')
                ) {
                  <span class="error">Mínimo 2 caracteres</span>
                }
              </div>
              <div class="form-group">
                <label for="segundoNombre">Segundo nombre</label>
                <input
                  id="segundoNombre"
                  type="text"
                  formControlName="segundoNombre"
                  autocomplete="additional-name"
                />
              </div>
            </div>

            <!-- Apellidos -->
            <div class="form-row">
              <div class="form-group">
                <label for="primerApellido">Primer apellido *</label>
                <input
                  id="primerApellido"
                  type="text"
                  formControlName="primerApellido"
                  autocomplete="family-name"
                />
                @if (
                  form.get('primerApellido')?.touched &&
                  form.get('primerApellido')?.hasError('required')
                ) {
                  <span class="error">Campo obligatorio</span>
                }
                @if (
                  form.get('primerApellido')?.touched &&
                  form.get('primerApellido')?.hasError('minlength')
                ) {
                  <span class="error">Mínimo 2 caracteres</span>
                }
              </div>
              <div class="form-group">
                <label for="segundoApellido">Segundo apellido *</label>
                <input
                  id="segundoApellido"
                  type="text"
                  formControlName="segundoApellido"
                  autocomplete="family-name"
                />
                @if (
                  form.get('segundoApellido')?.touched &&
                  form.get('segundoApellido')?.hasError('required')
                ) {
                  <span class="error">Campo obligatorio</span>
                }
                @if (
                  form.get('segundoApellido')?.touched &&
                  form.get('segundoApellido')?.hasError('minlength')
                ) {
                  <span class="error">Mínimo 2 caracteres</span>
                }
              </div>
            </div>

            <!-- Fecha nacimiento -->
            <div class="form-group">
              <label for="fechaNacimiento">Fecha de nacimiento *</label>
              <input
                id="fechaNacimiento"
                type="date"
                formControlName="fechaNacimiento"
              />
              @if (
                form.get('fechaNacimiento')?.touched &&
                form.get('fechaNacimiento')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
            </div>

            <!-- Tipo y número de documento -->
            <div class="form-row">
              <div class="form-group">
                <label for="tipoDocumento">Tipo de documento *</label>
                <select id="tipoDocumento" formControlName="tipoDocumento">
                  <option value="" disabled>Seleccionar...</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="Otro">Otro</option>
                </select>
                @if (
                  form.get('tipoDocumento')?.touched &&
                  form.get('tipoDocumento')?.hasError('required')
                ) {
                  <span class="error">Campo obligatorio</span>
                }
              </div>
              <div class="form-group">
                <label for="numeroDocumento">Número de documento *</label>
                <input
                  id="numeroDocumento"
                  type="text"
                  formControlName="numeroDocumento"
                  placeholder="1234567890"
                />
                @if (
                  form.get('numeroDocumento')?.touched &&
                  form.get('numeroDocumento')?.hasError('required')
                ) {
                  <span class="error">Campo obligatorio</span>
                }
                @if (
                  form.get('numeroDocumento')?.touched &&
                  form.get('numeroDocumento')?.hasError('minlength')
                ) {
                  <span class="error">Mínimo 5 dígitos</span>
                }
                @if (
                  form.get('numeroDocumento')?.touched &&
                  form.get('numeroDocumento')?.hasError('pattern')
                ) {
                  <span class="error">Solo números</span>
                }
              </div>
            </div>

            <!-- Género -->
            <div class="form-group">
              <label for="genero">Género *</label>
              <select id="genero" formControlName="genero">
                <option value="" disabled>Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
              @if (
                form.get('genero')?.touched &&
                form.get('genero')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
            </div>

            <!-- EPS -->
            <div class="form-group">
              <label for="eps">EPS *</label>
              <input
                id="eps"
                type="text"
                formControlName="eps"
                placeholder="Nombre de tu EPS"
              />
              @if (
                form.get('eps')?.touched &&
                form.get('eps')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
            </div>

            <!-- Contacto emergencia -->
            <div class="form-group">
              <label for="contactoEmergencia"
                >Número contacto de emergencia *</label
              >
              <input
                id="contactoEmergencia"
                type="tel"
                formControlName="contactoEmergencia"
                placeholder="3001234567"
                autocomplete="tel"
              />
              @if (
                form.get('contactoEmergencia')?.touched &&
                form.get('contactoEmergencia')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
              @if (
                form.get('contactoEmergencia')?.touched &&
                form.get('contactoEmergencia')?.hasError('pattern')
              ) {
                <span class="error"
                  >Ingresa un número de teléfono válido (solo números, 7-10
                  dígitos)</span
                >
              }
            </div>

            <!-- Talla camiseta -->
            <div class="form-group">
              <label for="tallaCamiseta">Talla de camiseta *</label>
              <select id="tallaCamiseta" formControlName="tallaCamiseta">
                <option value="" disabled>Seleccionar...</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              @if (
                form.get('tallaCamiseta')?.touched &&
                form.get('tallaCamiseta')?.hasError('required')
              ) {
                <span class="error">Campo obligatorio</span>
              }
            </div>

            <!-- Error message -->
            @if (errorMsg()) {
              <div class="alert-error">❌ {{ errorMsg() }}</div>
            }

            <!-- Submit -->
            <button type="submit" class="submit-btn" [disabled]="submitting()">
              @if (submitting()) {
                ⏳ Registrando...
              } @else {
                ✅ Confirmar Inscripción
              }
            </button>
          </form>
        } @else {
          <!-- Success state -->
          <div class="success-state">
            <div class="success-icon">🎉</div>
            <h2 class="success-title">¡Ya te inscribiste!</h2>
            <p class="success-text">
              Tu inscripción en la
              <strong>{{
                form.get('distancia')?.value === '10k'
                  ? '10K Competitiva'
                  : '5K Recreativa'
              }}</strong>
              ha sido registrada exitosamente.
            </p>

            <div class="success-steps">
              <h3>📝 Solo resta un paso:</h3>
              <ol>
                <li>
                  Realiza el pago según la distancia elegida
                  <strong
                    >({{
                      form.get('distancia')?.value === '10k' ? '10K' : '5K'
                    }})</strong
                  >
                </li>
                <li>
                  <strong>Envía el comprobante de pago</strong> al WhatsApp:<br />
                  <strong>📱 311 622 7064</strong>
                </li>
                <li>Recibirás confirmación de tu inscripción</li>
              </ol>

              <div class="payment-qr">
                <p class="qr-label">Puedes pagar escaneando este QR:</p>
                <div class="qr-placeholder glass-card">
                  <img
                    src="/assets/paPagar.png"
                    alt="QR de pago"
                    class="qr-img"
                  />
                  <p class="qr-hint">Bancolombia / Nequi / Ahorro a la mano</p>
                </div>
              </div>
            </div>

            <p class="success-check">
              💡 Puedes consultar el estado de tu pago en la sección
              <strong>"Consultar Estado"</strong> con tu número de documento.
            </p>

            <button class="submit-btn" (click)="close()">Entendido ✔️</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 2rem;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all var(--transition-micro);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-primary);
        }
      }

      /* ── Header ── */
      .modal-header {
        margin-bottom: 1.5rem;
      }

      .modal-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-text-primary);
        margin: 0 0 0.5rem;
      }

      .modal-subtitle {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        margin: 0;
        strong {
          color: var(--color-accent);
        }
      }

      /* ── Form ── */
      .modal-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        @media (max-width: 500px) {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          letter-spacing: 0.03em;
        }

        input,
        select {
          padding: 0.7rem 0.875rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.9rem;
          font-family: var(--font-sans);
          transition: border-color var(--transition-fast);

          &:focus {
            outline: none;
            border-color: var(--color-primary-light);
            box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15);
          }

          &::placeholder {
            color: var(--color-text-muted);
          }
        }

        select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2rem;
        }
      }

      .error {
        font-size: 0.75rem;
        color: #ef4444;
        font-weight: 500;
      }

      .distance-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .distance-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-micro);

        input[type='radio'] {
          accent-color: var(--color-primary-light);
          width: 18px;
          height: 18px;
        }

        .dist-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        &.selected {
          border-color: var(--color-primary-light);
          background: rgba(45, 106, 79, 0.1);

          .dist-label {
            color: var(--color-text-primary);
          }
        }

        &:hover {
          border-color: var(--color-primary-light);
        }

        @media (max-width: 400px) {
          padding: 0.7rem;
          .dist-label {
            font-size: 0.82rem;
          }
        }
      }

      .alert-error {
        padding: 0.75rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-md);
        color: #fca5a5;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .submit-btn {
        width: 100%;
        padding: 1rem;
        background: var(--gradient-primary);
        color: white;
        font-weight: 700;
        font-size: 1.05rem;
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        font-family: var(--font-sans);
        transition: all var(--transition-spring);
        margin-top: 0.5rem;

        &:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: var(--shadow-glow-green);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      /* ── Success ── */
      .success-state {
        text-align: center;
        padding: 1rem 0;
      }

      .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .success-title {
        font-size: 1.75rem;
        font-weight: 900;
        color: var(--color-text-primary);
        margin: 0 0 0.75rem;
      }

      .success-text {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin: 0 0 1.5rem;
        strong {
          color: var(--color-accent);
        }
      }

      .success-steps {
        text-align: left;
        background: rgba(45, 106, 79, 0.05);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.25rem 1.5rem;
        margin-bottom: 1.25rem;

        h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 0.75rem;
        }

        ol {
          margin: 0 0 1.5rem;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          li {
            font-size: 0.9rem;
            color: var(--color-text-secondary);
            line-height: 1.6;
            strong {
              color: var(--color-primary);
            }
          }
        }
      }

      .payment-qr {
        text-align: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
      }

      .qr-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 0.75rem;
      }

      .qr-placeholder {
        background: white;
        padding: 1rem;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        border-radius: var(--radius-md);
      }

      .qr-img {
        width: 200px;
        height: 200px;
        object-fit: contain;
        background: #f1f5f9;
        border-radius: var(--radius-sm);
      }

      .qr-hint {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 600;
        margin: 0;
      }

      .success-check {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        margin: 0 0 1.5rem;
        strong {
          color: var(--color-text-secondary);
        }
      }
    `,
  ],
})
export class RegistrationModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inscripcionService = inject(InscripcionService);
  readonly dialogRef = inject(MatDialogRef<RegistrationModalComponent>);
  readonly data: ModalData = inject(MAT_DIALOG_DATA);

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.nonNullable.group({
    distancia: [this.data.distancia || '5k', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    primerNombre: ['', [Validators.required, Validators.minLength(2)]],
    segundoNombre: [''],
    primerApellido: ['', [Validators.required, Validators.minLength(2)]],
    segundoApellido: ['', [Validators.required, Validators.minLength(2)]],
    fechaNacimiento: ['', Validators.required],
    tipoDocumento: ['', Validators.required],
    numeroDocumento: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    genero: ['', Validators.required],
    eps: ['', [Validators.required, Validators.minLength(2)]],
    contactoEmergencia: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)],
    ],
    tallaCamiseta: ['', Validators.required],
  });

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set('');

    const payload = this.form.getRawValue();

    this.inscripcionService.crear(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.error || 'Error al registrar. Intenta de nuevo.';
        this.errorMsg.set(msg);
      },
    });
  }
}
