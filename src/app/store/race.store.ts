import {
  signalStore,
  withState,
  withMethods,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { patchState } from '@ngrx/signals';

export interface PriceStage {
  name: string;
  emoji: string;
  dateRange: string;
  price5k: number;
  price10k: number;
  startDate: Date;
  endDate: Date;
}

export interface Modality {
  id: '5k' | '10k';
  name: string;
  tag?: string;
  distance: string;
  description: string;
  benefits: string[];
  icon: string;
}

export const PRICE_STAGES: PriceStage[] = [
  {
    name: 'Creyentes',
    emoji: '🙏',
    dateRange: '15 Feb – 31 Mar',
    price5k: 85_000,
    price10k: 95_000,
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-03-31T23:59:59'),
  },
  {
    name: 'Valientes',
    emoji: '💪',
    dateRange: '1 Abr – 31 Ago',
    price5k: 105_000,
    price10k: 120_000,
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-08-31T23:59:59'),
  },
  {
    name: 'Gladiadores',
    emoji: '⚔️',
    dateRange: '1 Sep – 30 Sep',
    price5k: 125_000,
    price10k: 145_000,
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-30T23:59:59'),
  },
];

function getCurrentStage(): PriceStage {
  const now = new Date();
  return (
    PRICE_STAGES.find((s) => now >= s.startDate && now <= s.endDate) ??
    PRICE_STAGES[PRICE_STAGES.length - 1]
  );
}

interface RaceState {
  modalities: Modality[];
  selectedDistance: '5k' | '10k' | null;
  currentStage: PriceStage;
  allStages: PriceStage[];
}

const initialState: RaceState = {
  selectedDistance: null,
  currentStage: getCurrentStage(),
  allStages: PRICE_STAGES,
  modalities: [
    {
      id: '5k',
      name: '5K Recreativa',
      distance: '5 Kilómetros',
      description:
        'Ideal para disfrutar en familia, con amigos, y vivir la cultura cafetera que caracteriza a nuestra región. ' +
        '¡Perfecta para quienes quieren dar sus primeros pasos en el atletismo!',
      benefits: [
        'Kit del corredor (camiseta + número)',
        'Medalla de finisher',
        'Hidratación en ruta',
        'Fruta y refrigerio al finalizar',
        'Fotografías del evento',
        'Chip de tiempo',
      ],
      icon: '🏃',
    },
    {
      id: '10k',
      name: '10K Competitiva',
      tag: '¡Nueva!',
      distance: '10 Kilómetros',
      description:
        'Diseñada para corredores que buscan superarse. Una ruta técnica que combina la belleza del ' +
        'Paisaje Cultural Cafetero con la exigencia de nuestras lomas. ¡El reto que esperabas!',
      benefits: [
        'Kit del corredor premium (camiseta técnica + número)',
        'Medalla oficial + trofeo top 3 por categoría',
        'Chip de cronometraje oficial',
        'Hidratación avanzada (4 puntos en ruta)',
        'Masajes de recuperación post-carrera',
        'Fotografías y video oficial del evento',
        'Certificado digital con tiempo oficial',
      ],
      icon: '🏆',
    },
  ],
};

export const RaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ modalities, selectedDistance, currentStage }) => ({
    selectedModality: computed(
      () => modalities().find((m) => m.id === selectedDistance()) ?? null,
    ),
    hasSelection: computed(() => selectedDistance() !== null),
    selectedPrice: computed(() => {
      const dist = selectedDistance();
      const stage = currentStage();
      if (!dist) return null;
      return dist === '5k' ? stage.price5k : stage.price10k;
    }),
    selectedPriceLabel: computed(() => {
      const dist = selectedDistance();
      const stage = currentStage();
      if (!dist) return null;
      const price = dist === '5k' ? stage.price5k : stage.price10k;
      return `$${price.toLocaleString('es-CO')} COP`;
    }),
  })),
  withMethods((store) => ({
    selectDistance(id: '5k' | '10k'): void {
      patchState(store, { selectedDistance: id });
    },
    clearSelection(): void {
      patchState(store, { selectedDistance: null });
    },
  })),
);
