export const environment = {
  production: true,
  apiUrl: 'https://usermanagementapi-62ej.onrender.com/api/',
  // Configuraciones adicionales
  appName: 'SerFinanzas',
  version: '1.0.0',
  // Configuración para países
  enableStaticCountries: true, // Usar países estáticos si la API falla
  // Configuración de autenticación
  authTokenKey: 'accessToken',
  // Configuración de timeout
  requestTimeout: 10000 // 10 segundos
};