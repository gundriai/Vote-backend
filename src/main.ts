import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve a blank favicon to avoid 404 errors
  app.use('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  app.enableCors({
    origin: true,  // Allow all origins for development
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.use(cookieParser());
  
  // Enable sessions for storing redirect URLs
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 60000, // 1 minute - just enough for OAuth flow
    },
  }));
  const port = process.env.PORT || 3300;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
