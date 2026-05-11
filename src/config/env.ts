export const ENV = {
  VITE_API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME ?? 'CollabSync',
  VITE_APP_URL: import.meta.env.VITE_APP_URL ?? 'http://localhost:3000',
};