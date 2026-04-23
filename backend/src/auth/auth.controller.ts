import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RequestCodeDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    private getFrontendUrl() {
        return process.env.WEBAPP_URL || 'https://mytourist-navy.vercel.app';
    }

    @Post('request-code')
    @ApiOperation({ summary: 'Request a verification code to be sent via email' })
    async requestCode(@Body() requestCodeDto: RequestCodeDto) {
        return this.authService.requestCode(requestCodeDto);
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
        res.redirect(`${this.getFrontendUrl()}/?token=${access_token}`);
    }


    @Post('demo')
    @ApiOperation({ summary: 'Guest/Demo Login' })
    async demoLogin() {
        return this.authService.demoLogin();
    }

    /* 
     * Manual registration disabled as per security policy 
     * (Passwords are not stored in this application)
     */
    // @Post('request-code')
    // ...
    // @Post('register')
    // ...
    // @Post('login')
    // ...

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
