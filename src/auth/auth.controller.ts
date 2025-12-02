import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// ...existing code...
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  // Google login
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { status: 'redirecting to google' };
  }
  // Google callback
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.socialLogin(req.user, 'google');
      // Redirect with only the access token
      const redirectUrl = `https://merovote.online/auth/success?access_token=${encodeURIComponent(result.accessToken)}`;
      //const redirectUrl = `http://localhost:5173/auth/success?access_token=${encodeURIComponent(result.accessToken)}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google callback error:', err);
      // Return a simple HTML page so popup flows can display error info
      return res.status(500).send(`<html><body><h3>Authentication error</h3><pre>${String(err)}</pre><p>Please check server logs.</p><script>if(window.opener){window.opener.postMessage({type:'oauth', error: 'server_error'}, '*'); window.close();}</script></body></html>`);
    }
  }
  // Facebook login
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return { status: 'redirecting to facebook' };
  }
  // Facebook callback
  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.socialLogin(req.user, 'facebook');
      console.log(result.accessToken);
      const redirectUrl = `https://merovote.online/auth/success?access_token=${encodeURIComponent(result.accessToken)}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Facebook callback error:', err);
      return res.status(500).send(`<html><body><h3>Authentication error</h3><pre>${String(err)}</pre><p>Please check server logs.</p><script>if(window.opener){window.opener.postMessage({type:'oauth', error: 'server_error'}, '*'); window.close();}</script></body></html>`);
    }
  }
  // Optional: me endpoint to fetch user info securely
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return req.user;
  }
}