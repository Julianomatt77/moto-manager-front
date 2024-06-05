import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule, NgIf} from "@angular/common";
import {StorageService} from "../../services/storage/storage.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    RouterModule
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
  email = '';
  submitted: boolean = false;
  usernameErrorMessage = '';
  passwordErrorMessage = '';
  isRegistration = false;
  label = '';
  passwordFieldType: string = 'password';
  passwordFieldIcon = 'visibility_off'

  constructor(private authService: AuthService, private router: Router, private storageService: StorageService, private activatedroute:ActivatedRoute) {
    this.isRegistration = false;
  }

  ngOnInit() {
    this.isRegistration = false;

    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });

    this.activatedroute.data.subscribe(data => {
      this.isRegistration = data["registration"];
    })

    this.label = this.isRegistration ? "S'enregistrer" : "Se connecter";

    this.usernameErrorMessage = 'Un email est obligatoire est obligatoire.';
    this.passwordErrorMessage = 'Un mot de passe est obligatoire.';
  }

  onSubmit() {
    const username = this.loginForm.value.username.toLowerCase();
    const password = this.loginForm.value.password;
    this.submitted = true;

    if (this.loginForm.valid) {
      this.error = '';
      this.isLoginFailed = false;

      if (!this.isRegistration) {
        this.logInUser(username, password)
      } else {
        this.authService.register(username, password)
          .subscribe({
            next: (data) => {
              if (data.status){
                this.logInUser(username, password)
              } else {
                this.error = data.message
                this.isLoginFailed = true;
              }
            },
            error: (error) => {
              this.error = error.error.message
              this.isLoginFailed = true;
            }
          })
      }
    }
  }

  logInUser(username: string, password: string){
    this.authService.login(username, password)
      .subscribe({
        next: (data) => {
          this.token = data.token;
          this.isLoginFailed = false;
          this.authService.saveToken(this.token)
          this.isLoggedIn = true;

          this.authService.getUserInfos()
            .subscribe({
              next: (data) => {
                this.storageService.saveUser(data)
                this.email = this.storageService.getUser().email
                this.isLoggedIn = true;

                window.sessionStorage.removeItem('mm_hasReloaded');
                // Redirection après login
                setTimeout(() => {
                  this.router.navigateByUrl('');
                }, 2000);
              }
            })
        },
        error: (error) => {
          this.error = error.error.message
          this.isLoginFailed = true;
        },
      })
  }

  togglePasswordVisibility(): void {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordFieldIcon = 'visibility';
    } else {
      this.passwordFieldType = 'password';
      this.passwordFieldIcon = 'visibility_off';
    }
  }
}
