import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CountdownStore } from '../../store/countdown.store';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, MatCardModule],
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
              <div class="countdown-number" [class.animate-flip]="unit.animate">
                {{ unit.value | number: '2.0-0' }}
              </div>
              <div class="countdown-label">{{ unit.label }}</div>
            </div>
          }
        </div>
        <p class="countdown-tagline">⏱️ ¡El tiempo corre! Inscríbete hoy</p>
      } @else {
        <div class="expired-message glass-card">
          <span class="text-4xl">🏁</span>
          <p class="text-xl font-bold text-white mt-2">
            ¡La carrera está en curso!
          </p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .countdown-wrapper {
        text-align: center;
        padding: 2rem 0;
      }

      .countdown-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        max-width: 520px;
        margin: 0 auto;

        @media (max-width: 480px) {
          grid-template-columns: repeat(2, 1fr);
          max-width: 280px;
        }
      }

      .countdown-card {
        padding: 1.25rem 0.75rem;
        text-align: center;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }

      .countdown-number {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        color: var(--color-accent);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 0 20px rgba(244, 162, 97, 0.5);
        transition: all 0.3s ease;
      }

      .countdown-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-top: 0.5rem;
      }

      .countdown-tagline {
        color: var(--color-text-muted);
        margin-top: 1.5rem;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
      }

      .expired-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        margin: 0 auto;
        max-width: 300px;
      }

      @keyframes flip {
        0% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(0.9);
          color: white;
        }
        100% {
          transform: scaleY(1);
        }
      }
    `,
  ],
})
export class CountdownComponent implements OnInit, OnDestroy {
  protected store = inject(CountdownStore);
  private platformId = inject(PLATFORM_ID);

  countdownUnits() {
    return [
      { label: 'Días', value: this.store.days(), animate: false },
      { label: 'Horas', value: this.store.hours(), animate: false },
      { label: 'Minutos', value: this.store.minutes(), animate: false },
      { label: 'Segundos', value: this.store.seconds(), animate: false },
    ];
  }

  ngOnInit(): void {
    this.store.start(this.platformId);
  }

  ngOnDestroy(): void {
    this.store.stop();
  }
}
