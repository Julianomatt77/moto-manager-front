import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: `
    <label class="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox"
             [checked]="checked()"
             [disabled]="disabled()"
             (change)="changed.emit(!checked())"
             class="sr-only peer" />
      <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-disabled:opacity-50 transition-colors duration-200">
        <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200"></div>
      </div>
      <ng-content />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {
  checked = input(false);
  disabled = input(false);
  changed = output<boolean>();
}
