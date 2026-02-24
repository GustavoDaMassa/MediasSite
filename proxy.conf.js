const BACKEND_URL = 'https://apimediasapi.gustavohdev.com.br';

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
