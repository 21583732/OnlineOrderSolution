import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NavbarPublicComponent  } from './components/navbar-public/navbar-public';
import { NavbarPrivateComponent } from './components/navbar-private/navbar-private';
import { NavbarWelcomeComponent } from './components/navbar-welcome/navbar-welcome';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductsComponent } from './components/products/products';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetailsComponent } from './components/order-details/order-details';
import { NewOrderComponent } from './components/new-order/new-order';
import { ProfileComponent } from './components/profile/profile';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WelcomeComponent } from './components/welcome/welcome';
import { ConfirmCancelDialogComponent } from './components/confirm-cancel-dialog/confirm-cancel-dialog';

import { AuthInterceptor } from './core/auth.interceptor';
import { AuthService } from './core/auth.service';
import { ApiService } from './core/api.service';


import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarPublicComponent,
    NavbarPrivateComponent,
    NavbarWelcomeComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    OrdersComponent,
    OrderDetailsComponent,
    NewOrderComponent,
    ProfileComponent,
    WelcomeComponent,
    ConfirmCancelDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    OAuthModule.forRoot()
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    AuthService,
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
