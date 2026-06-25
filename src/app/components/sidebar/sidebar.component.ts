import {Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {IconComponent} from '../../shared/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private authSub: Subscription | null = null;

  isMenuOpen = false;
  isLoggedIn = false;

  ngOnInit(): void {
    this.authSub = this.authService.isAuthenticated.subscribe(value => {
      this.isLoggedIn = value;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('');
    });
  }
}
