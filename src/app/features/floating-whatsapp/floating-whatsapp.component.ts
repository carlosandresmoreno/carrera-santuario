import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const WHATSAPP_NUMBER = '573107333078';

@Component({
  selector: 'app-floating-whatsapp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        class="fab-whatsapp"
        (click)="openWhatsApp()"
        aria-label="Contactar por WhatsApp para inscripción o dudas"
        title="¿Dudas? ¡Escríbenos!"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
        <span class="fab-tooltip">¿Dudas? ¡Escríbenos!</span>
      </button>
    }
  `,
  styles: [
    `
      .fab-whatsapp {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: #25d366;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 4px 20px rgba(37, 211, 102, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.2);
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal);
        animation:
          fab-entrance 0.5s ease-out,
          fab-pulse 3s ease-in-out 1s infinite;

        &:hover {
          transform: scale(1.1);
          box-shadow:
            0 6px 30px rgba(37, 211, 102, 0.6),
            0 4px 12px rgba(0, 0, 0, 0.3);

          .fab-tooltip {
            opacity: 1;
            transform: translateX(-100%) translateX(-12px) translateY(-50%);
          }
        }

        @media (max-width: 400px) {
          width: 52px;
          height: 52px;
          bottom: 1rem;
          right: 1rem;

          svg {
            width: 24px;
            height: 24px;
          }
        }
      }

      .fab-tooltip {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateX(-100%) translateX(-12px) translateY(-50%);
        background: var(--color-bg-card, #1a2e23);
        color: white;
        font-size: 0.8rem;
        font-weight: 600;
        font-family: var(--font-sans);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition:
          opacity var(--transition-normal),
          transform var(--transition-normal);
        pointer-events: none;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          border-style: solid;
          border-width: 6px 0 6px 6px;
          border-color: transparent transparent transparent
            var(--color-bg-card, #1a2e23);
        }
      }

      @keyframes fab-entrance {
        from {
          opacity: 0;
          transform: scale(0) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes fab-pulse {
        0%,
        100% {
          box-shadow:
            0 4px 20px rgba(37, 211, 102, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2);
        }
        50% {
          box-shadow:
            0 4px 30px rgba(37, 211, 102, 0.6),
            0 2px 12px rgba(0, 0, 0, 0.2),
            0 0 0 8px rgba(37, 211, 102, 0.1);
        }
      }
    `,
  ],
})
export class FloatingWhatsappComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const onScroll = () => {
        this.visible.set(window.scrollY > window.innerHeight * 0.6);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() =>
        window.removeEventListener('scroll', onScroll),
      );

      // Initial check
      onScroll();
    });
  }

  openWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const msg =
      '¡Hola! Estoy viendo la página de *Santuario Corre 5K & 10K 2026* y tengo una consulta.\n' +
      '¿Me pueden ayudar? ¡Gracias!';

    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  }
}
