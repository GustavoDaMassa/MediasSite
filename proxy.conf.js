const BACKEND_URL = 'http://localhost:8080';

module.exports = {
  '/api': {
    target: BACKEND_URL,
    secure: true,
    changeOrigin: true,
    logLevel: 'info',
  },
  '/authenticate': {
    target: BACKEND_URL,
    secure: true,
    changeOrigin: true,
    logLevel: 'info',
  },
};
