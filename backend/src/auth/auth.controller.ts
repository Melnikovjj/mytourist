import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('telegram')
    @ApiOperation({ summary: 'Authenticate via Telegram initData' })
    async telegramAuth(@Body('initData') initData: string) {
        return this.authService.authenticateUser(initData);
    }

    @Get('health')
    health() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}
