import {Component, input, output, computed, ChangeDetectionStrategy} from '@angular/core';
import {IconComponent} from './icon.component';

@Component({
  selector: 'app-paginator',
  imports: [IconComponent],
  template: `
    <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4 text-sm">
      <span class="text-gray-500">
        Éléments {{ startItem() }} à {{ endItem() }} / {{ length() }}
      </span>

      <div class="flex items-center gap-2">
        <label for="page-size" class="text-gray-500">Par page :</label>
        <select
          id="page-size"
          [value]="pageSize()"
          (change)="pageSizeChange.emit(+$any($event.target).value)"
          class="px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option [value]="5">5</option>
          <option [value]="10">10</option>
          <option [value]="25">25</option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <button (click)="changePage.emit(0)"
                [disabled]="pageIndex() === 0"
                class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                type="button"
                title="Première page">
          <app-icon name="double-chevron-left" />
        </button>
        <button (click)="changePage.emit(pageIndex() - 1)"
                [disabled]="pageIndex() === 0"
                class="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                type="button"
                title="Page précédente">
          <app-icon name="chevron-left" />
        </button>
        <span class="text-gray-600 font-medium mx-2">
          {{ pageIndex() + 1 }} / {{ totalPages() }}
        </span>
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
         <app-icon name="double-chevron-right" />
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  length = input(0);
  pageSize = input(10);
  pageIndex = input(0);
  changePage = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.length() / this.pageSize())));

  startItem = computed(() => {
    if (this.length() === 0) return 0;
    return this.pageIndex() * this.pageSize() + 1;
  });

  endItem = computed(() => {
    if (this.length() === 0) return 0;
    return Math.min((this.pageIndex() + 1) * this.pageSize(), this.length());
  });
}
