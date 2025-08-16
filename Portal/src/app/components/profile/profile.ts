import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  loading = true;
  error = '';
  client: any = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.auth.getUserIdFromToken();
    if (!clientId) {
      this.error = 'Not authenticated';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.api.getClientById(clientId).subscribe({
      next: (data) => {
        this.client = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.error = 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    // navigate to welcome page (home)
    this.router.navigate(['/']).then(() => this.cdr.detectChanges());
  }
}
