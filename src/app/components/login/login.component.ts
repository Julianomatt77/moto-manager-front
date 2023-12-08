import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {CommonModule, NgIf} from "@angular/common";
import {StorageService} from "../../services/storage/storage.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent {
  loginForm: FormGroup;
  token: string;
  isLoggedIn= false;
  isLoginFailed = false;
  error: string;

  constructor(private authService: AuthService, private router: Router, private storageService: StorageService) {  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  onSubmit() {
    const username = this.loginForm.value.username.toLowerCase();
    const password = this.loginForm.value.password;

    this.authService.login(username, password)
      .subscribe({
        next: (data) => {
          this.token = data.token;
          this.isLoggedIn = true;
          this.isLoginFailed = false;

          this.authService.saveToken(this.token)

          // Redirection après login
          setTimeout(() => {
            this.router.navigateByUrl('');
          }, 2000);

        },
        error: (error) => {
          this.error = error.error.message
          this.isLoginFailed = true;
        },
      })
  }

}
