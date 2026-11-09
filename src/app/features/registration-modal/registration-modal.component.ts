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
import { calculatePrice } from '../../core/constants/discount-codes';

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
          X
        </button>

        @if (!success()) {
          <!-- Form Header -->
          <div class="modal-header">
            <h2 class="modal-title">Formulario de Inscripcion</h2>
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
                  <span class="dist-label">5K Recreativa</span>
                </label>
                <label
                  class="distance-option"
                  [class.selected]="form.get('distancia')?.value === '10k'"
                >
                  <input type="radio" formControlName="distancia" value="10k" />
                  <span class="dist-label">10K Competitiva</span>
                </label>
              </div>
            </div>

            <!-- Correo -->
            <div class="form-group">
              <label for="correo">Correo electronico *</label>
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
                  >Ingresa un correo valido (ej: tu&#64;correo.com)</span
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

            <!-- Tipo y numero de documento -->
            <div class="form-row">
              <div class="form-group">
                <label for="tipoDocumento">Tipo de documento *</label>
                <select id="tipoDocumento" formControlName="tipoDocumento">
                  <option value="" disabled>Seleccionar...</option>
                  <option value="CC">Cedula de ciudadania</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cedula de extranjeria</option>
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
                <label for="numeroDocumento">Numero de documento *</label>
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
                  form.get('numeroDocumento')?.hasError('pattern')
                ) {
                  <span class="error">Solo numeros</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="genero">Genero *</label>
              <select id="genero" formControlName="genero">
                <option value="" disabled>Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>

            <div class="form-group">
              <label for="eps">EPS *</label>
              <input id="eps" type="text" formControlName="eps" placeholder="EPS" />
            </div>

            <!-- Contacto emergencia -->
            <div class="form-group">
              <label for="contactoEmergencia">Telefono contacto de emergencia *</label>
              <input
                id="contactoEmergencia"
                type="tel"
                formControlName="contactoEmergencia"
                placeholder="3001234567"
              />
            </div>

            <!-- Telefono Personal -->
            <div class="form-group">
              <label for="telefono">Tu numero de telefono *</label>
              <input
                id="telefono"
                type="tel"
                formControlName="telefono"
                placeholder="3001234567"
              />
            </div>

            <div class="form-group">
              <label for="ciudad">Ciudad de residencia *</label>
              <input
                id="ciudad"
                type="text"
                formControlName="ciudad"
                placeholder="Ej: Santuario"
              />
            </div>

            <div class="form-group">
              <label for="tallaCamiseta">Talla de camiseta *</label>
              <select id="tallaCamiseta" formControlName="tallaCamiseta">
                <option value="" disabled>Seleccionar...</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <!-- Codigo de Descuento -->
            <div class="form-group">
              <label for="codigoDescuento">
                Codigo de descuento (opcional)
                <span class="discount-label-hint">Si tienes un cupón promocional, ingrésalo aquí</span>
              </label>
              <input
                id="codigoDescuento"
                type="text"
                formControlName="codigoDescuento"
                placeholder="Ej: BTXESTE"
                style="text-transform: uppercase;"
              />

              @if (form.get('codigoDescuento')?.value?.trim()) {
                @if (priceInfo().hasDiscount) {
                  <div class="discount-status success">
                    <span class="status-icon">🎉</span>
                    <div class="status-content">
                      <strong>¡Código {{ priceInfo().cleanCode }} aplicado!</strong>
                      <span>Descuento del 15% aplicado con éxito. Ahorras $ {{ priceInfo().discount | number:'1.0-0' }} COP.</span>
                    </div>
                  </div>
                } @else {
                  <div class="discount-status invalid">
                    <span class="status-icon">⚠️</span>
                    <div class="status-content">
                      <span>Código inválido o expirado. Verifica que esté bien escrito.</span>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Resumen de Valor a Pagar -->
            <div class="price-breakdown-card">
              <div class="price-row">
                <span>Inscripción {{ form.get('distancia')?.value === '10k' ? '10K Competitiva' : '5K Recreativa' }}</span>
                <span [class.struck-price]="priceInfo().hasDiscount">
                  $ {{ priceInfo().basePrice | number:'1.0-0' }} COP
                </span>
              </div>

              @if (priceInfo().hasDiscount) {
                <div class="price-row discount-applied-row">
                  <span>Descuento especial (15%)</span>
                  <span class="discount-val">- $ {{ priceInfo().discount | number:'1.0-0' }} COP</span>
                </div>
              }

              <div class="price-row total-row">
                <strong>Total a transferir:</strong>
                <strong class="total-price">$ {{ priceInfo().finalPrice | number:'1.0-0' }} COP</strong>
              </div>
            </div>

            @if (errorMsg()) {
              <div class="alert-error">{{ errorMsg() }}</div>
            }

            <button type="submit" class="submit-btn" [disabled]="submitting()">
              {{ submitting() ? 'Registrando...' : 'Confirmar Inscripcion' }}
            </button>
          </form>
        } @else {
          <!-- Success state -->
          <div class="success-state">
            <h2 class="success-title">¡Ya te inscribiste! 🎉</h2>
            <p class="success-text">
              Tu inscripción ha sido registrada exitosamente.
            </p>
            <div class="success-steps">
              <!-- Destacado del monto exacto a pagar -->
              <div class="amount-to-pay-box">
                <span class="amount-label">Monto exacto a transferir:</span>
                <div class="amount-val">
                  $ {{ priceInfo().finalPrice | number:'1.0-0' }} COP
                </div>
                @if (priceInfo().hasDiscount) {
                  <div class="amount-discount-tag">
                    🎉 ¡Incluye 15% de descuento por código <strong>{{ priceInfo().cleanCode }}</strong>!
                  </div>
                }
              </div>

              <h3>Solo resta un paso para asegurar tu cupo:</h3>
              <ol>
                <li>
                  Realiza la transferencia de <strong>$ {{ priceInfo().finalPrice | number:'1.0-0' }} COP</strong>
                </li>
                <li>Envía el comprobante al WhatsApp: <strong>311 622 7064</strong></li>
                <li>Recibirás confirmación pronto</li>
              </ol>

              <div class="payment-qr" style="text-align: center; margin-top: 1.5rem;">
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.75rem;">
                  Puedes pagar escaneando este QR:
                </p>
                <div style="background: white; padding: 0.75rem; display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-soft);">
                  <img
                    src="assets/paPagar.png"
                    alt="QR de pago"
                    style="width: 160px; height: 160px; object-fit: contain;"
                  />
                  <p style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin: 0;">
                    Bancolombia / Nequi / Ahorro a la mano
                  </p>
                </div>
              </div>
            </div>
            <button class="submit-btn" (click)="close()">Entendido</button>
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
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .modal-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 2.5rem;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
      }
      .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        color: var(--color-text-primary);
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .modal-header { margin-bottom: 2rem; }
      .modal-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
      .modal-subtitle { color: var(--color-text-secondary); font-size: 0.9rem; }
      .modal-form { display: flex; flex-direction: column; gap: 1rem; }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 500px) {
        .form-row { grid-template-columns: 1fr; }
        .modal-container { padding: 1.5rem; }
      }
      .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
      .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); }
      .form-group input, .form-group select {
        padding: 0.75rem;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: var(--radius-sm);
        color: var(--color-text-primary);
        font-size: 1rem;
      }
      .distance-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .distance-option {
        padding: 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        text-align: center;
      }
      .distance-option.selected { border-color: var(--color-primary); background: rgba(45, 106, 79, 0.2); }
      .distance-option input { display: none; }
      .submit-btn {
        padding: 1rem;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-weight: 700;
        cursor: pointer;
        margin-top: 1rem;
      }
      .error { color: #ef4444; font-size: 0.75rem; }
      .alert-error { padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: var(--radius-sm); }
      .success-state { text-align: center; }
      .success-steps { text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem; margin: 1.5rem 0; border-radius: var(--radius-sm); }

      /* Discount styling */
      .discount-label-hint {
        display: block;
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-weight: 400;
        margin-top: 0.15rem;
      }
      .discount-status {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        margin-top: 0.6rem;
        padding: 0.7rem 0.9rem;
        border-radius: var(--radius-sm, 6px);
        font-size: 0.82rem;
        line-height: 1.4;
      }
      .discount-status.success {
        background: rgba(34, 197, 94, 0.12);
        border: 1px solid rgba(34, 197, 94, 0.35);
        color: #22c55e;
      }
      .discount-status.invalid {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
      }
      .discount-status .status-icon {
        font-size: 1.1rem;
      }
      .discount-status .status-content {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      /* Price Breakdown Card */
      .price-breakdown-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md, 8px);
        padding: 1rem 1.25rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
        color: var(--color-text-secondary);
      }
      .struck-price {
        text-decoration: line-through;
        opacity: 0.55;
      }
      .discount-applied-row {
        color: #22c55e;
        font-weight: 600;
      }
      .discount-val {
        font-weight: 700;
      }
      .price-row.total-row {
        border-top: 1px dashed var(--color-border);
        padding-top: 0.6rem;
        margin-top: 0.25rem;
        font-size: 1.05rem;
        color: var(--color-text-primary);
      }
      .total-price {
        color: var(--color-accent, #3b82f6);
        font-size: 1.2rem;
        font-weight: 800;
      }

      /* Success Amount Box */
      .amount-to-pay-box {
        background: rgba(37, 99, 235, 0.1);
        border: 1px solid rgba(37, 99, 235, 0.35);
        border-radius: var(--radius-md, 8px);
        padding: 1.25rem 1rem;
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .amount-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-secondary);
        font-weight: 700;
      }
      .amount-val {
        font-size: 2rem;
        font-weight: 900;
        color: #38bdf8;
        margin: 0.35rem 0;
      }
      .amount-discount-tag {
        font-size: 0.85rem;
        color: #22c55e;
        font-weight: 600;
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
      [Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9]+$/)],
    ],
    genero: ['', Validators.required],
    eps: ['', [Validators.required, Validators.minLength(2)]],
    contactoEmergencia: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
    ciudad: ['', Validators.required],
    tallaCamiseta: ['', Validators.required],
    codigoDescuento: [''],
  });

  readonly priceInfo = signal(
    calculatePrice(this.data.distancia || '5k', ''),
  );

  constructor() {
    this.form.valueChanges.subscribe((val) => {
      this.priceInfo.set(
        calculatePrice(val.distancia || '5k', val.codigoDescuento),
      );
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('📝 Form submit triggered');
    if (this.form.invalid) {
      console.warn('❌ Form is invalid:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors != null) {
          console.warn(`Field ${key} errors:`, controlErrors);
        }
      });
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set('');

    const rawValue = this.form.getRawValue();
    const dataToSend = {
      ...rawValue,
      codigoDescuento: rawValue.codigoDescuento ? rawValue.codigoDescuento.trim().toUpperCase() : '',
    };

    console.log('🚀 Sending data to service:', dataToSend);
    this.inscripcionService.crear(dataToSend).subscribe({
      next: (res) => {
        console.log('✅ Registration success:', res);
        this.submitting.set(false);
        this.success.set(true);
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        this.submitting.set(false);
        const msg = (typeof err.error === 'string' ? err.error : err.error?.error) || err.message || 'Error al registrar. Intenta de nuevo.';
        this.errorMsg.set(msg);
      },
    });
  }
}
