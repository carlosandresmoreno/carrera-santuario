import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
}

const SITE_URL = 'https://carrera-santuario-5k-10k.onrender.com';
const SITE_NAME = 'Santuario Corre';
const OG_IMAGE = `${SITE_URL}/assets/og-image.jpg`;
const INSTAGRAM = 'https://www.instagram.com/santuariocorre5ky10k/';
const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeeo5UXa64vaFIqhxt0NFxYf-jCCTHa7I4c08sbFw8zFTJFyw/viewform';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  /** Update all head meta tags */
  updateMeta(config: SeoConfig): void {
    const url = config.url ?? SITE_URL + '/';
    const img = config.image ?? OG_IMAGE;

    this.title.setTitle(config.title);

    // Primary
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CO' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: img });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'Santuario Corre 2026 – 5K & 10K Risaralda',
    });

    // Twitter / X Card
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({
      name: 'twitter:site',
      content: '@santuariocorre5ky10k',
    });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: img });
  }

  /** Inject or update <link rel="canonical"> */
  setCanonical(path = '/'): void {
    const href = SITE_URL + path;
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** Inject JSON-LD script tag (replaces any existing one) */
  injectJsonLd(schema: object): void {
    this.doc
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((el) => el.remove());

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 0);
    this.doc.head.appendChild(script);
  }

  /** Full @graph schema: WebSite + Organization + SportsEvent */
  buildRaceSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': SITE_URL + '/#website',
          url: SITE_URL + '/',
          name: SITE_NAME,
          description:
            'Carrera atlética 5K y 10K en Santuario, Risaralda. Organizada por el Bosque Campista Tamaná.',
          inLanguage: 'es-CO',
          publisher: { '@id': SITE_URL + '/#organization' },
        },
        {
          '@type': 'Organization',
          '@id': SITE_URL + '/#organization',
          name: 'Bosque Campista Tamaná',
          url: SITE_URL + '/',
          logo: SITE_URL + '/assets/og-image.jpg',
          sameAs: [INSTAGRAM],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+57-310-733-3078',
            contactType: 'customer support',
            availableLanguage: 'Spanish',
          },
        },
        {
          '@type': 'SportsEvent',
          '@id': SITE_URL + '/#event',
          name: 'Santuario Corre 5K & 10K 2026 – Segunda Edición',
          description:
            'Carrera atlética 5K recreativa y 10K competitiva por el Paisaje Cultural Cafetero de Risaralda. Organizada por jóvenes voluntarios del Bosque Campista Tamaná.',
          url: SITE_URL + '/',
          startDate: '2026-10-18T07:00:00-05:00',
          endDate: '2026-10-18T13:00:00-05:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          sport: 'Running',
          image: OG_IMAGE,
          location: {
            '@type': 'Place',
            name: 'Bosque Campista Tamaná – Santuario',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Bosque Campista Tamaná',
              addressLocality: 'Santuario',
              addressRegion: 'Risaralda',
              addressCountry: 'CO',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '5.0667',
              longitude: '-75.9833',
            },
          },
          organizer: { '@id': SITE_URL + '/#organization' },
          performer: {
            '@type': 'Organization',
            name: 'Bosque Campista Tamaná',
          },
          offers: [
            {
              '@type': 'Offer',
              name: '5K Recreativa',
              price: '85000',
              priceCurrency: 'COP',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-03-01',
              validThrough: '2026-10-10',
              url: FORM_URL,
            },
            {
              '@type': 'Offer',
              name: '10K Competitiva',
              price: '95000',
              priceCurrency: 'COP',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-03-01',
              validThrough: '2026-10-10',
              url: FORM_URL,
            },
          ],
        },
      ],
    };
  }
}
