import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID') || 'FACEBOOK_APP_ID_NOT_SET';
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET') || 'FACEBOOK_APP_SECRET_NOT_SET';
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL') || 'https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/auth/facebook/callback';

    super({ clientID, clientSecret, callbackURL, scope: 'email', profileFields: ['id', 'displayName', 'emails', 'photos'] });

    if (clientID === 'FACEBOOK_APP_ID_NOT_SET' || clientSecret === 'FACEBOOK_APP_SECRET_NOT_SET') {
      Logger.warn('Facebook OAuth env vars not set (FACEBOOK_APP_ID/FACEBOOK_APP_SECRET). Using placeholders.', FacebookStrategy.name);
    }
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = (profile.emails && profile.emails[0]?.value) || undefined;
    const photo = (profile.photos && profile.photos[0]?.value) || undefined;
    return {
      id: profile.id,
      email,
      name: profile.displayName,
      photo,
    };
  }
}


