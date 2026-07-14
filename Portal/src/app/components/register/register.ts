import { Component } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  username = '';
  password = '';
  confirmPassword = '';
  email = '';

  message = '';

  passwordRequirements = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  private validateEmail(email: string): boolean {

    const regex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return regex.test(email.trim());
  }

  validatePassword() {

    this.passwordRequirements.length =
      this.password.length >= 8;

    this.passwordRequirements.upper =
      /[A-Z]/.test(this.password);

    this.passwordRequirements.lower =
      /[a-z]/.test(this.password);

    this.passwordRequirements.number =
      /\d/.test(this.password);

    this.passwordRequirements.special =
      /[^A-Za-z0-9]/.test(this.password);

  }

  register() {

    this.message = '';
    this.cdr.markForCheck();

    this.validatePassword();

    if (!this.username.trim()) {
      this.message = 'Username is required.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.message = 'Please enter a valid email address.';
      return;
    }

    if (!this.passwordRequirements.length ||
        !this.passwordRequirements.upper ||
        !this.passwordRequirements.lower ||
        !this.passwordRequirements.number ||
        !this.passwordRequirements.special) {

      this.message =
        'Password does not meet the minimum security requirements.';

      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    this.apiService.registerClient({

      username: this.username.trim(),

      email: this.email.trim().toLowerCase(),

      password: this.password,

      confirmPassword: this.confirmPassword

    }).subscribe({

      next: () => {

        this.message =
          'Registration successful! Redirecting to login...';

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 3000);

      },

      error: (err) => {

        this.message = '';
        this.cdr.markForCheck();

        if (typeof err.error === 'string') {

          this.message = err.error;

        }
        else if (err.error?.message) {

          this.message = err.error.message;

        }
        else {

          this.message = 'Registration failed.';

        }

      }

    });

  }

}