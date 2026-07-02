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
  client: any = {
    firstName: '',
    lastName: '',
    address: {
      streetAddress: '',
      city: '',
      province: '',
      postalCode: '',
      country: ''
    }
  };
  saving = false;

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

        if (!this.client.address) {
          this.client.address = {
            streetAddress: '',
            city: '',
            province: '',
            postalCode: '',
            country: ''
          };
        }

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

  saveProfile() {

  const clientId = this.auth.getUserIdFromToken();

  if (!clientId)
    return;

  this.saving = true;

  const payload = {
    firstName: this.client.firstName,
    lastName: this.client.lastName,
    streetAddress: this.client.address.streetAddress,
    city: this.client.address.city,
    province: this.client.address.province,
    postalCode: this.client.address.postalCode,
    country: this.client.address.country
  };

  this.api.updateProfile(clientId, payload).subscribe({

    next: () => {

      this.saving = false;

      this.router.navigate(['/products']);

    },

    error: () => {

      this.saving = false;
      this.error = 'Failed to save profile';

    }

  });

}

  logout(): void {
    this.auth.logout();
    // navigate to welcome page (home)
    this.router.navigate(['/']).then(() => this.cdr.detectChanges());
  }
}
