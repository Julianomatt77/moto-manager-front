import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterModule} from '@angular/router';
import {IconComponent} from '../../shared/icon.component';

@Component({
  selector: 'app-error',
  imports: [RouterModule, IconComponent],
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {

}
