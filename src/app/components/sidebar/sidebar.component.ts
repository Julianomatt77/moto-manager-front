import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = computed(() => this.authService.isAuthenticated());
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('');
  }
}
