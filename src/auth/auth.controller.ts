import { Controller, Get, Req, Res, UseGuards, Logger, Query, Session } from '@nestjs/common';
// ...existing code...
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  private determineRedirectUrl(req: any): string {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    
    // Check if it's a mobile app (Expo/React Native)
    if (userAgent.includes('Expo') || userAgent.includes('ReactNative') || userAgent.includes('Mobile')) {
      this.logger.log('Detected mobile client');
      return 'merovoteapp://auth/success'; // Deep link scheme
    }
    
    // Check if it's coming from a specific domain
    if (referer.includes('localhost:5173')) {
      this.logger.log('Detected web client from localhost:5173');
      return 'http://localhost:5173/auth/success';
    }
    
    if (referer.includes('localhost:8081')) {
      this.logger.log('Detected web client from localhost:8081');
      return 'http://localhost:8081/auth/success';
    }
    
    // Default fallback
    this.logger.log('Using default redirect URL');
    return 'http://localhost:5173/auth/success';
  }

  // Google login
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: any) {
    this.logger.log('Google login initiated');
    const redirectUrl = this.determineRedirectUrl(req);
    this.logger.log(`Determined redirect URL: ${redirectUrl}`);
    
    // Store redirect URL in session for callback
    req.session = req.session || {};
    req.session.redirectUrl = redirectUrl;
    
    return { status: 'redirecting to google' };
  }

  // Google callback
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    this.logger.log('Google callback received');
    const result = await this.authService.socialLogin(req.user, 'google');

    // Get redirect URL from session (set during login initiation)
    const redirectUrl = req.session?.redirectUrl || 'http://localhost:5173/auth/success';
    this.logger.log(`Using redirect URL from session: ${redirectUrl}`);

    // Add access token to redirect URL
    const finalRedirectUrl = `${redirectUrl}?access_token=${encodeURIComponent(result.accessToken)}`;
    this.logger.log(`Redirecting to: ${finalRedirectUrl}`);
    return res.redirect(finalRedirectUrl);
  }

  // Facebook login
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Req() req: any) {
    this.logger.log('Facebook login initiated');
    const redirectUrl = this.determineRedirectUrl(req);
    this.logger.log(`Determined redirect URL: ${redirectUrl}`);
    
    // Store redirect URL in session for callback
    req.session = req.session || {};
    req.session.redirectUrl = redirectUrl;
    
    return { status: 'redirecting to facebook' };
  }

  // Facebook callback
  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: Response) {
    this.logger.log('Facebook callback received');
    const result = await this.authService.socialLogin(req.user, 'facebook');
    this.logger.log('Facebook login successful, access token generated');

    // Get redirect URL from session (set during login initiation)
    const redirectUrl = req.session?.redirectUrl || 'http://localhost:5173/auth/success';
    this.logger.log(`Using redirect URL from session: ${redirectUrl}`);

    // Add access token to redirect URL
    const finalRedirectUrl = `${redirectUrl}?access_token=${encodeURIComponent(result.accessToken)}`;
    this.logger.log(`Redirecting to: ${finalRedirectUrl}`);
    return res.redirect(finalRedirectUrl);
  }

  // Optional: me endpoint to fetch user info securely
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    this.logger.log(`User info requested for user: ${req.user?.id || 'unknown'}`);
    return req.user;
  }
}
