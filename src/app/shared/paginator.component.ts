import {Component, input, output, computed, ChangeDetectionStrategy} from '@angular/core';
import {IconComponent} from './icon.component';

@Component({
  selector: 'app-paginator',
  imports: [IconComponent],
  template: `
    <div class="flex items-center justify-center gap-4 py-4 text-sm">
      <button (click)="changePage.emit(0)"
              [disabled]="pageIndex() === 0"
              class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              type="button"
              title="Première page">
        <app-icon name="chevron-left" />
      </button>
      <button (click)="changePage.emit(pageIndex() - 1)"
              [disabled]="pageIndex() === 0"
              class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              type="button"
              title="Page précédente">
        <app-icon name="chevron-left" />
      </button>
      <span class="text-gray-600 font-medium">
        Page {{ pageIndex() + 1 }} / {{ totalPages() }}
      </span>
      <span class="text-gray-400">({{ length() }} éléments)</span>
      <button (click)="changePage.emit(pageIndex() + 1)"
              [disabled]="pageIndex() >= totalPages() - 1"
              class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              type="button"
              title="Page suivante">
        <app-icon name="chevron-right" />
      </button>
      <button (click)="changePage.emit(totalPages() - 1)"
              [disabled]="pageIndex() >= totalPages() - 1"
              class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              type="button"
              title="Dernière page">
        <app-icon name="chevron-right" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  length = input(0);
  pageSize = input(10);
  pageIndex = input(0);
  changePage = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.length() / this.pageSize())));
}
