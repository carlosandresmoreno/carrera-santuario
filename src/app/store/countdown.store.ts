import { signalStore, withState, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { isPlatformBrowser } from '@angular/common';
import { inject, NgZone } from '@angular/core';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const RACE_DATE = new Date('2026-10-18T07:00:00-05:00');

function calculateTimeLeft(): CountdownState {
  const now = new Date();
  const diff = RACE_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

let _intervalId: ReturnType<typeof setInterval> | null = null;

export const CountdownStore = signalStore(
  { providedIn: 'root' },
  withState<CountdownState>(calculateTimeLeft()),
  withMethods((store) => {
    const zone = inject(NgZone);

    return {
      start(platformId: object): void {
        if (!isPlatformBrowser(platformId)) return;
        if (_intervalId !== null) return;

        // Run the interval directly. Since we are in the browser and want
        // to trigger change detection, we use zone.run for the patchState.
        _intervalId = setInterval(() => {
          zone.run(() => {
            patchState(store, calculateTimeLeft());
          });
        }, 1000);
      },

      stop(): void {
        if (_intervalId !== null) {
          clearInterval(_intervalId);
          _intervalId = null;
        }
      },
    };
  }),
);
