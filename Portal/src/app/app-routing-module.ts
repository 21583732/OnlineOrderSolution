import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { WelcomeComponent } from './components/welcome/welcome';
import { ProductsComponent } from './components/products/products';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetailsComponent } from './components/order-details/order-details';
import { NewOrderComponent } from './components/new-order/new-order';
import { ProfileComponent } from './components/profile/profile';

import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  // Public routes
  { path: '',component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Private routes (protected)
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuard] },
  { path: 'new-order', component: NewOrderComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Fallback
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
