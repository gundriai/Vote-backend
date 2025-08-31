import { Injectable } from '@nestjs/common';
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
    const user = await this.usersService.upsertSocialUser({
      provider,
      providerId: profile.id,
      email: profile.email,
      name: profile.name,
      photo: profile.photo,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: String(user.id),
      email: user.email,
      name: user.name,
      provider: user.provider,
      role: user.role,
    });
    return { accessToken, user };
  }
}


