import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('API-GATEWAY');
  const app = await NestFactory.create(ApiGatewayModule);

  app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));

  app.use('/products', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
  }));
  
  app.use('/orders', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
  }));
  
  const port = 3000;
  await app.listen(port);
  logger.log(`Gateway is running: http://localhost:${port}`);
}
bootstrap();