import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve a blank favicon to avoid 404 errors
  app.use('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  app.enableCors({
    origin: 'http://localhost:5173', // exact match
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3300, '0.0.0.0'); // Listen on all interfaces
  console.log(`Server running on http://localhost:3300`);
}

bootstrap();
