import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CountdownComponent } from '../countdown/countdown.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, CountdownComponent],
  template: `
    <header class="hero-wrapper" role="banner">
      <!-- Navigation -->
      <nav class="hero-nav glass-card" aria-label="Navegación principal">
        <div class="nav-inner section-container">
          <a
            href="#"
            class="nav-logo"
            aria-label="Santuario Corre 5K & 10K – Inicio"
          >
            <span class="logo-icon">🌿</span>
            <span class="logo-text">Santuario <strong>Corre</strong></span>
          </a>
          <ul class="nav-links" role="list">
            <li>
              <a href="#historia" aria-label="Nuestra historia"
                >Nuestra Historia</a
              >
            </li>
            <li>
              <a href="#modalidades" aria-label="Ver modalidades de carrera"
                >Modalidades</a
              >
            </li>
            <li>
              <a href="#instagram" aria-label="Ver galería de Instagram"
                >Galería</a
              >
            </li>
            <li>
              <a
                href="#inscripcion"
                class="nav-cta"
                aria-label="Inscribirse a la carrera"
                >Inscríbete</a
              >
            </li>
          </ul>
        </div>
      </nav>

      <!-- Hero Content -->
      <section class="hero-content" aria-labelledby="hero-title">
        <!-- Background Image (Placeholder) -->
        <div class="hero-bg-image" aria-hidden="true">
          <img
            ngSrc="/assets/hero-placeholder.webp"
            alt="Corredor en los paisajes cafeteros de Risaralda, Colombia"
            fill
            priority
            fetchpriority="high"
            class="object-cover w-full h-full"
          />
          <div class="hero-overlay" aria-hidden="true"></div>
        </div>

        <!-- Background Video (deferred) -->
        <div class="hero-bg-video" aria-hidden="true">
          @defer (on idle) {
            <video
              autoplay
              muted
              loop
              playsinline
              class="object-cover w-full h-full"
              aria-hidden="true"
            >
              <source src="/assets/hero-video.mp4" type="video/mp4" />
            </video>
          } @placeholder {
            <div class="video-placeholder" aria-hidden="true"></div>
          }
        </div>

        <!-- Text Content -->
        <div class="hero-text section-container">
          <div
            class="hero-badge animate-fade-in-up"
            style="animation-delay:0.1s"
          >
            <span>🗓️ 18 de Octubre, 2026</span>
            <span class="badge-sep">•</span>
            <span>Bosque Campista Tamaná</span>
            <span class="badge-sep">•</span>
            <span>Santuario, Risaralda</span>
          </div>

          <h1
            id="hero-title"
            class="hero-title animate-fade-in-up"
            style="animation-delay:0.25s"
          >
            Santuario Corre 2026
            <span class="hero-title-highlight">5K &amp; 10K Risaralda</span>
          </h1>

          <p
            class="hero-subtitle animate-fade-in-up"
            style="animation-delay:0.4s"
          >
            Segunda Edición · Fomento del liderazgo juvenil y estilos de vida
            saludables.<br />
            ¡Vive la experiencia en el corazón del Paisaje Cultural Cafetero!
          </p>

          <!-- Countdown -->
          <div
            class="hero-countdown animate-fade-in-up"
            style="animation-delay:0.55s"
          >
            <app-countdown />
          </div>

          <!-- CTA Buttons -->
          <div
            class="hero-actions animate-fade-in-up"
            style="animation-delay:0.7s"
          >
            <a
              href="#inscripcion"
              class="btn-primary"
              aria-label="Inscribirse ahora a Santuario Corre 5K & 10K 2026"
            >
              📋 Inscríbete Ahora
            </a>
            <a
              href="#modalidades"
              class="btn-secondary"
              aria-label="Ver modalidades disponibles"
            >
              Ver Modalidades
            </a>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator" aria-hidden="true">
          <div class="scroll-mouse">
            <div class="scroll-dot"></div>
          </div>
          <span>Explora</span>
        </div>
      </section>
    </header>
  `,
  styles: [
    `
      .hero-wrapper {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
      }

      /* ── Navbar ── */
      .hero-nav {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 2rem);
        max-width: 1200px;
        z-index: var(--z-nav);
        border-radius: var(--radius-lg);
        padding: 0.875rem 1.5rem;
      }

      .nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0;
      }

      .nav-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--color-text-primary);
        font-size: 1.1rem;
        font-weight: 500;

        .logo-icon {
          font-size: 1.5rem;
        }
        strong {
          color: var(--color-accent);
        }
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;

        a {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color var(--transition-fast);

          &:hover {
            color: var(--color-text-primary);
          }
        }

        .nav-cta {
          background: var(--gradient-accent);
          color: white !important;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          transition:
            transform var(--transition-spring),
            box-shadow var(--transition-normal) !important;

          &:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow-glow-accent);
          }
        }

        @media (max-width: 640px) {
          gap: 1rem;
          li:nth-child(1),
          li:nth-child(2) {
            display: none;
          }
        }
      }

      /* ── Hero Section ── */
      .hero-content {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden;
      }

      .hero-bg-image,
      .hero-bg-video {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .hero-bg-image img {
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: var(--gradient-hero);
      }

      .hero-bg-video {
        z-index: 1;

        video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-hero);
        }
      }

      .hero-text {
        position: relative;
        z-index: 2;
        text-align: center;
        padding-top: 6rem;
        padding-bottom: 4rem;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(244, 162, 97, 0.15);
        border: 1px solid rgba(244, 162, 97, 0.3);
        border-radius: var(--radius-full);
        padding: 0.375rem 1.25rem;
        font-size: 0.85rem;
        color: var(--color-accent-light);
        font-weight: 500;
        margin-bottom: 1.5rem;
        letter-spacing: 0.05em;
      }

      .badge-sep {
        opacity: 0.4;
      }

      .hero-title {
        font-size: var(--font-size-hero);
        font-weight: 900;
        line-height: var(--line-height-tight);
        color: white;
        margin: 0 0 0.5rem;
        text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
      }

      .hero-title-highlight {
        display: block;
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        color: rgba(240, 255, 244, 0.8);
        margin: 1rem auto 2rem;
        max-width: 600px;
        line-height: 1.7;
      }

      .hero-countdown {
        margin: 1.5rem auto;
        max-width: 540px;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--gradient-accent);
        color: white;
        font-weight: 700;
        padding: 0.875rem 2.25rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        font-size: 1.05rem;
        letter-spacing: 0.03em;
        box-shadow: var(--shadow-glow-accent);
        transition:
          transform var(--transition-spring),
          box-shadow var(--transition-normal);

        &:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 0 50px rgba(244, 162, 97, 0.5);
        }
      }

      .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: 2px solid rgba(240, 255, 244, 0.3);
        color: rgba(240, 255, 244, 0.9);
        font-weight: 600;
        padding: 0.875rem 2.25rem;
        border-radius: var(--radius-full);
        text-decoration: none;
        font-size: 1.05rem;
        transition:
          border-color var(--transition-normal),
          background var(--transition-normal);

        &:hover {
          border-color: rgba(240, 255, 244, 0.6);
          background: rgba(240, 255, 244, 0.08);
        }
      }

      /* ── Scroll indicator ── */
      .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: rgba(240, 255, 244, 0.5);
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .scroll-mouse {
        width: 24px;
        height: 38px;
        border: 2px solid rgba(240, 255, 244, 0.3);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        padding-top: 6px;
      }

      .scroll-dot {
        width: 4px;
        height: 8px;
        background: var(--color-accent);
        border-radius: 2px;
        animation: scrollDown 2s ease-in-out infinite;
      }

      @keyframes scrollDown {
        0%,
        100% {
          transform: translateY(0);
          opacity: 1;
        }
        50% {
          transform: translateY(8px);
          opacity: 0.3;
        }
      }
    `,
  ],
})
export class HeroComponent {}
