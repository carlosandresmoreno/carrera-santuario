import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  afterNextRender,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { CountdownStore } from '../../store/countdown.store';
import { RaceStore } from '../../store/race.store';

@Component({
  selector: 'app-countdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="countdown-wrapper">
      @if (!store.expired()) {
        <div
          class="countdown-grid"
          aria-label="Cuenta regresiva hasta la carrera"
        >
          @for (unit of countdownUnits(); track unit.label) {
            <div
              class="countdown-card glass-card"
              [attr.aria-label]="unit.value + ' ' + unit.label"
            >
              <div class="countdown-number">
                {{ padNumber(unit.value) }}
              </div>
              <div class="countdown-label">{{ unit.label }}</div>
            </div>
          }
        </div>
        <p class="countdown-tagline">
          ⏱️ Cada segundo cuenta —
          <strong>¡asegura tu cupo antes de que suban los precios!</strong>
        </p>
        <p class="countdown-stage-deadline">
          🔥 Etapa <strong>{{ raceStore.currentStage().name }}</strong> termina
          el
          <strong>{{
            (raceStore.currentStage().dateRange.split('–')[1] || '').trim() ||
              'pronto'
          }}</strong>
        </p>
      } @else {
        <div class="expired-message glass-card">
          <span class="expired-icon">🏁</span>
          <p class="expired-text">¡La carrera está en curso!</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .countdown-wrapper {
        text-align: center;
        padding: var(--space-xl) 0;
      }

      .countdown-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-md);
        max-width: 520px;
        margin: 0 auto;

        @media (max-width: 480px) {
          grid-template-columns: repeat(2, 1fr);
          max-width: 280px;
        }
      }

      .countdown-card {
        padding: var(--space-lg) var(--space-sm);
        text-align: center;
        transition: transform var(--transition-micro);

        &:hover {
          transform: translateY(-3px) scale(1.02);
        }
      }

      .countdown-number {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        color: var(--color-accent);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 0 24px rgba(244, 162, 97, 0.45);
        transition:
          transform var(--transition-micro),
          text-shadow var(--transition-micro);
      }

      .countdown-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-top: var(--space-sm);
      }

      .countdown-tagline {
        color: var(--color-text-muted);
        margin-top: var(--space-lg);
        font-size: 0.9rem;
        letter-spacing: 0.03em;

        strong {
          color: rgba(240, 255, 244, 0.9);
          font-weight: 700;
        }
      }

      .countdown-stage-deadline {
        color: var(--color-accent-light);
        margin-top: var(--space-sm);
        font-size: 0.82rem;
        letter-spacing: 0.03em;
        opacity: 0.85;

        strong {
          color: var(--color-accent);
          font-weight: 700;
        }
      }

      .expired-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-xl);
        margin: 0 auto;
        max-width: 300px;
      }

      .expired-icon {
        font-size: 2.5rem;
      }

      .expired-text {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: var(--space-sm) 0 0;
      }
    `,
  ],
})
export class CountdownComponent {
  protected readonly store = inject(CountdownStore);
  protected readonly raceStore = inject(RaceStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly countdownUnits = computed(() => [
    { label: 'Días', value: this.store.days() },
    { label: 'Horas', value: this.store.hours() },
    { label: 'Minutos', value: this.store.minutes() },
    { label: 'Segundos', value: this.store.seconds() },
  ]);

  constructor() {
    afterNextRender(() => {
      this.store.start(this.platformId);
      this.destroyRef.onDestroy(() => this.store.stop());
    });
  }

  padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
