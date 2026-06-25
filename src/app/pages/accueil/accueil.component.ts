import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import {RouterModule} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {IconComponent} from '../../shared/icon.component';

@Component({
  selector: 'app-accueil',
  imports: [RouterModule, NgOptimizedImage, IconComponent],
  templateUrl: './accueil.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccueilComponent {
  private storageService = inject(StorageService);
  isLoggedIn: boolean = this.storageService.isLoggedIn();
}
