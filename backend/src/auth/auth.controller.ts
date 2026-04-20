import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Initiate Google OAuth' })
    async googleAuth() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const { access_token } = this.authService.buildOAuthResponse(req.user);
        res.redirect(`http://localhost:5173/?token=${access_token}`);
    }

    @Get('yandex')
    @UseGuards(AuthGuard('yandex'))
    @ApiOperation({ summary: 'Initiate Yandex OAuth' })
    async yandexAuth() {}

    @Get('yandex/callback')
    @UseGuards(AuthGuard('yandex'))
    @ApiOperation({ summary: 'Yandex OAuth callback' })
    async yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
        const { access_token } = this.authService.buildOAuthResponse(req.user);
        res.redirect(`http://localhost:5173/?token=${access_token}`);
    }

    @Post('demo')
    @ApiOperation({ summary: 'Guest/Demo Login' })
    async demoLogin() {
        return this.authService.demoLogin();
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('telegram')
    @ApiOperation({ summary: 'Authenticate via Telegram initData (Legacy)' })
    async telegramAuth(@Body('initData') initData: string) {
        return this.authService.authenticateUser(initData);
    }

    @Get('health')
    health() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}
