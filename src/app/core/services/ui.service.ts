import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationModalComponent } from '../../features/registration-modal/registration-modal.component';
import { RaceStore } from '../../store/race.store';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(RaceStore);

  openRegistrationModal(distancia?: '5k' | '10k'): void {
    this.dialog.open(RegistrationModalComponent, {
      data: { distancia: distancia || this.store.selectedDistance() || '5k' },
      panelClass: 'registration-dialog-panel',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
    });
  }
}
