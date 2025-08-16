import { Component } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  message = ''; // For now, just plain password. In production, hash it.

  constructor(private apiService: ApiService, private router:Router) {}

  register() {
    this.apiService.registerClient({
      username: this.username,
      password: this.password,
      email: this.email
    }).subscribe({
      next: (res: any) => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() =>{
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.message = 'Registration failed: ' + (err.error || 'Unknown error');
      }
    });
  }
}
