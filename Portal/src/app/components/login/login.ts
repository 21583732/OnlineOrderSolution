import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  isLoading = false;

  constructor(
    private apiService: ApiService, 
    private auth: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    this.errorMessage = '';

    this.isLoading = true;

    this.apiService.login(this.username.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.auth.setToken(res.token);
        this.cdr.markForCheck();
        
        if (res.profileComplete) {
          this.router.navigate(['/products']);
        } else {
          this.router.navigate(['/profile']);
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed';
        this.cdr.markForCheck();
      }
    });
  }
}
