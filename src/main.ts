import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Serve blank favicon to avoid 404s
  app.use('/favicon.ico', (req, res) => res.status(204).end());

  // Enable CORS for mobile and web
  app.enableCors({
    origin: true, // Allow all origins for dev, restrict in production
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Needed for session cookies
  });

  // Parse cookies
  app.use(cookieParser());

  // Session middleware for storing redirect URLs (used in OAuth flow)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set true in production if using HTTPS
        maxAge: 5 * 60 * 1000, // 5 minutes
      },
    }),
  );

  const port = process.env.PORT || 3300;
  
  // Listen on all interfaces (0.0.0.0) so LAN devices like Expo Go can access it
  await app.listen(port, '0.0.0.0');
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Accessible on your LAN at http://<your-local-ip>:${port}`);
}

bootstrap();
