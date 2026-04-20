import { PassportStrategy } from '@nestjs/passport';
// @ts-ignore
import { Strategy } from 'passport-yandex';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor(private authService: AuthService) {
        const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
            ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
            : (process.env.BACKEND_URL || 'http://localhost:3000');

        super({
            clientID: process.env.YANDEX_CLIENT_ID || 'dummy_client_id_for_dev',
            clientSecret: process.env.YANDEX_CLIENT_SECRET || 'dummy_secret',
            callbackURL: `${baseUrl}/api/auth/yandex/callback`,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { id, emails, displayName, name, photos } = profile;
        const userPayload = {
            email: emails?.[0]?.value,
            firstName: name?.givenName || displayName,
            lastName: name?.familyName,
            avatarUrl: photos?.[0]?.value,
            provider: 'yandex',
            providerId: id,
        };

        try {
            const user = await this.authService.validateOAuthUser(userPayload);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
}
