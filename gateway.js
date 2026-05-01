const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// proxy ke service3
app.use('/service3', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^services/service3': '',
  },
}));

app.listen(port, () => {
  console.log(`API Gateway jalan di port ${port}`);
});