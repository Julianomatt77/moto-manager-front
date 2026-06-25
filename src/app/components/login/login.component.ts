import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private activatedroute = inject(ActivatedRoute);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(null),
  });
  token: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  error = '';
  email = '';
  submitted = false;
  isRegistration = false;
  label = 'Se connecter';
  passwordFieldType: string = 'password';
  isPasswordConfirmed = false;
  usernameErrorMessage = 'Un email est obligatoire.';
  passwordErrorMessage = 'Un mot de passe est obligatoire.';
  confirmPasswordMissingErrorMessage = 'La confirmation du mot de passe est obligatoire.';
  confirmPasswordErrorMessage = 'Les mots de passe ne correspondent pas.';

  ngOnInit() {
    this.activatedroute.data.subscribe(data => {
      this.isRegistration = data['registration'] === true;
      this.label = this.isRegistration ? "S'enregistrer" : 'Se connecter';
    });
  }

  async onSubmit() {
    const username = this.loginForm.value.username?.toLowerCase() || '';
    const password = this.loginForm.value.password || '';
    this.submitted = true;
    if (this.loginForm.valid) {
      this.error = '';
      this.isLoginFailed = false;
      if (!this.isRegistration) {
        await this.logInUser(username, password);
      } else {
        this.validatePasswordsMatch();
        if (this.isPasswordConfirmed) {
          try {
            const data = await this.authService.register(username, password);
            if (data.status) {
              await this.logInUser(username, password);
            } else {
              this.error = data.message;
              this.isLoginFailed = true;
            }
          } catch (error: any) {
            this.error = error.error.message;
            this.isLoginFailed = true;
          }
        } else {
          this.isLoginFailed = true;
          this.error = "Erreur lors de l'inscription.";
        }
      }
    }
  }

  async logInUser(username: string, password: string) {
    try {
      const data = await this.authService.login(username, password);
      this.token = data.token;
      this.isLoginFailed = false;
      this.authService.saveToken(this.token);
      this.isLoggedIn = true;
      const userInfo = await this.authService.getUserInfos();
      this.storageService.saveUser(userInfo);
      this.email = this.storageService.getUser().email;
      window.sessionStorage.removeItem('mm_hasReloaded');
      setTimeout(() => this.router.navigateByUrl(''), 2000);
    } catch (error: any) {
      this.error = error.error.message;
      this.isLoginFailed = true;
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  validatePasswordsMatch() {
    const passwordControl = this.loginForm.get('password')?.value;
    const confirmPasswordControl = this.loginForm.get('confirmPassword')?.value;
    this.isPasswordConfirmed = !!(passwordControl && confirmPasswordControl && passwordControl === confirmPasswordControl);
  }
}
