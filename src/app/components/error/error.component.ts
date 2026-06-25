import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-error',
    imports: [
        RouterModule
    ],
    templateUrl: './error.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './error.component.css'
})
export class ErrorComponent {

}
