import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    getProfile(@CurrentUser() user: any) {
        return this.usersService.findById(user.id);
    }

    @Patch('me')
    updateProfile(@CurrentUser() user: any, @Body() data: { weight?: number; username?: string; experienceLevel?: string }) {
        return this.usersService.updateProfile(user.id, data);
    }

    @Patch('complete-onboarding')
    completeOnboarding(@CurrentUser() user: any, @Body() data: { weight: number; username: string; experienceLevel: string }) {
        return this.usersService.completeOnboarding(user.id, data);
    }
}
