import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export type SocialProvider = 'google' | 'facebook';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async socialLogin(profile: any, provider: SocialProvider) {
    try {
      // defensive: make fields explicit
      const providerId = profile?.id;
      const email = profile?.email ?? undefined;
      const name = profile?.name ?? profile?.displayName ?? undefined;
      const photo = profile?.photo ?? profile?.photoUrl ?? profile?.photoUrlLarge ?? undefined;

      Logger.log(`socialLogin: provider=${provider} providerId=${providerId} email=${email}`, AuthService.name);

      const user = await this.usersService.upsertSocialUser({
        provider,
        providerId,
        email,
        name,
        photo,
      });

      const accessToken = await this.jwtService.signAsync({
        sub: String(user.id),
        email: user.email,
        name: user.name,
        provider: user.provider,
        role: user.role,
      });

      // Add a redirect URL to the response for the frontend to handle
      return {
        accessToken,
        user,
        redirectUrl: '/?login=success',
      };
    } catch (err) {
      Logger.error(`socialLogin failed for provider=${provider}`, String(err), AuthService.name);
      throw err;
    }
  }
}


