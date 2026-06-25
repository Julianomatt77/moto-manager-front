import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import {IconComponent} from './icon.component';

@Component({
  selector: 'app-dialog',
  imports: [IconComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="close.emit()"></div>
        <div class="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-6 m-4"
             [class.max-w-lg]="!wide()"
             [class.max-w-3xl]="wide()"
             (click)="$event.stopPropagation()">
          <button (click)="close.emit()"
                  class="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  type="button"
                  title="Fermer">
            <app-icon name="close" />
          </button>
          <ng-content />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  isOpen = input(false);
  close = output<void>();
  wide = input(false);
}
