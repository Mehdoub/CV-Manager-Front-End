export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  refreshTokenKeyName: 'refreshToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
