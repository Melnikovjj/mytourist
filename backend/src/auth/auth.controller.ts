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

    private getFrontendUrl(req: Request) {
        let referer = req.headers.referer;
        if (referer) {
            const url = new URL(referer);
            return url.origin;
        }
        return 'https://mytourist-navy.vercel.app';
    }

    @Get('google')
    @ApiOperation({ summary: 'Initiate Google OAuth (Teacher Mode)' })
    async googleAuth(@Req() req: Request, @Res() res: Response) {
        const user = await this.authService.validateOAuthUser({
            email: `google_user_${Math.floor(Math.random() * 10000)}@gmail.com`,
            firstName: 'Студент',
            lastName: '(Google)',
            provider: 'google',
            providerId: `mock_google_${Date.now()}`
        });
        const { access_token } = this.authService.buildOAuthResponse(user);
        
        // Временно делаем фейк-паузу для имитации загрузки реального провайдера
        setTimeout(() => {
            res.redirect(`${this.getFrontendUrl(req)}/?token=${access_token}`);
        }, 1000);
    }

    @Get('yandex')
    @ApiOperation({ summary: 'Initiate Yandex OAuth (Teacher Mode)' })
    async yandexAuth(@Req() req: Request, @Res() res: Response) {
        const user = await this.authService.validateOAuthUser({
            email: `yandex_user_${Math.floor(Math.random() * 10000)}@yandex.ru`,
            firstName: 'Студент',
            lastName: '(Яндекс)',
            provider: 'yandex',
            providerId: `mock_yandex_${Date.now()}`
        });
        const { access_token } = this.authService.buildOAuthResponse(user);
        
        // Временно делаем фейк-паузу для имитации загрузки реального провайдера
        setTimeout(() => {
            res.redirect(`${this.getFrontendUrl(req)}/?token=${access_token}`);
        }, 1000);
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
