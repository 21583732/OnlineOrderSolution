import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

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

  constructor(private apiService: ApiService, private auth: AuthService, private router: Router) {}

  onLogin() {
    this.apiService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/products']); // redirect after storing token
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}
