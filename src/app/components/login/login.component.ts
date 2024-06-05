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
  confirmPasswordErrorMessage = '';
  confirmPasswordMissingErrorMessage = '';
  isRegistration = false;
  label = '';
  passwordFieldType: string = 'password';
  passwordFieldIcon = 'visibility_off';
  isPasswordConfirmed = false;

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
      ]),
      confirmPassword: new FormControl(null, )
    });

    this.activatedroute.data.subscribe(data => {
      this.isRegistration = data["registration"];
    })

    this.label = this.isRegistration ? "S'enregistrer" : "Se connecter";

    this.usernameErrorMessage = 'Un email est obligatoire est obligatoire.';
    this.passwordErrorMessage = 'Un mot de passe est obligatoire.';
    this.confirmPasswordMissingErrorMessage = 'La confirmation du mot de passe est obligatoire.';
    this.confirmPasswordErrorMessage = 'Les mots de passe ne correspondent pas.';
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
        this.validatePasswordsMatch()

        if (this.isPasswordConfirmed){
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
        } else {
          this.isLoginFailed = true;
          this.error = 'Erreur lors de l\'inscription.';
        }
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

  validatePasswordsMatch(): void {
    const passwordControl = this.loginForm.get('password')?.value;
    const confirmPasswordControl = this.loginForm.get('confirmPassword')?.value;

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl !== confirmPasswordControl) {
        this.isPasswordConfirmed = false
      } else {
        this.isPasswordConfirmed = true
      }
    }
  }
}
