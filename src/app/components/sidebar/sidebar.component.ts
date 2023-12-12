import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {StorageService} from "../../services/storage/storage.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [
        RouterModule
    ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  providers: [AuthService]
})
export class SidebarComponent implements OnInit{
  isMenuOpen = false;
  isLoggedIn: boolean;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('');
      this.storageService.clean();
    });
    this.isLoggedIn = false;
  }
}
