import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://auth.yourdomain.com', // Your self-hosted IdP URL
  redirectUri: window.location.origin,
  clientId: 'clientportal_spa', // must match config in your IdP
  responseType: 'code',
  scope: 'openid profile email clientportal_api',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false
};
