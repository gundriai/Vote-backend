import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Logger,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // ---------------- Helper ----------------
  private determineRedirectUrl(req: any, queryRedirect?: string): string {
    if (queryRedirect) {
      this.logger.log(`Using redirect URL from query: ${queryRedirect}`);
      return queryRedirect;
    }

    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('Expo') || userAgent.includes('ReactNative')) {
      return 'merovoteapp://auth/success';
    }

    const referer = req.headers['referer'] || '';
    if (referer.includes('localhost:5173')) return 'https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/auth/success';
    if (referer.includes('localhost:8081')) return 'http://localhost:8081/auth/success';

    return 'https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/auth/success';
  }

  // ---------------- GOOGLE ----------------
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: any, @Query('redirect_uri') redirectUri?: string) {
    const redirectUrl = this.determineRedirectUrl(req, redirectUri);
    this.logger.log(`Google login initiated. Redirect: ${redirectUrl}`);

    // Store in session before Passport redirects
    req.session = req.session || {};
    req.session.redirectUrl = redirectUrl;

    return { status: 'redirecting to Google' };
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    this.logger.log('Google callback received');

    const result = await this.authService.socialLogin(req.user, 'google');

    const redirectUrl = req.session?.redirectUrl || 'https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/auth/success';
    const finalRedirectUrl = `${redirectUrl}?access_token=${encodeURIComponent(result.accessToken)}`;

    this.logger.log(`Redirecting user to: ${finalRedirectUrl}`);
    return res.redirect(finalRedirectUrl);
  }

  // ---------------- FACEBOOK ----------------
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Req() req: any, @Query('redirect_uri') redirectUri?: string) {
    const redirectUrl = this.determineRedirectUrl(req, redirectUri);
    this.logger.log(`Facebook login initiated. Redirect: ${redirectUrl}`);

    req.session = req.session || {};
    req.session.redirectUrl = redirectUrl;

    return { status: 'redirecting to Facebook' };
  }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: Response) {
    this.logger.log('Facebook callback received');

    const result = await this.authService.socialLogin(req.user, 'facebook');

    const redirectUrl = req.session?.redirectUrl || 'https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/auth/success';
    const finalRedirectUrl = `${redirectUrl}?access_token=${encodeURIComponent(result.accessToken)}`;

    this.logger.log(`Redirecting user to: ${finalRedirectUrl}`);
    return res.redirect(finalRedirectUrl);
  }

  // ---------------- JWT Protected /me ----------------
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return req.user;
  }
}
