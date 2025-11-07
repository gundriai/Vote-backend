import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'GOOGLE_CLIENT_ID_NOT_SET';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'GOOGLE_CLIENT_SECRET_NOT_SET';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3300/auth/google/callback';

    super({ clientID, clientSecret, callbackURL, scope: ['email', 'profile'] });

    if (clientID === 'GOOGLE_CLIENT_ID_NOT_SET' || clientSecret === 'GOOGLE_CLIENT_SECRET_NOT_SET') {
      Logger.warn('Google OAuth env vars not set (GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET). Using placeholders.', GoogleStrategy.name);
    }
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const photo = profile.photos?.[0]?.value;
    return {
      id: profile.id,
      email,
      name: profile.displayName,
      photo,
    };
  }
}


