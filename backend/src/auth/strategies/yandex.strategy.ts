import { PassportStrategy } from '@nestjs/passport';
// @ts-ignore
import { Strategy } from 'passport-yandex';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.YANDEX_CLIENT_ID || 'dummy_client_id_for_dev',
            clientSecret: process.env.YANDEX_CLIENT_SECRET || 'dummy_secret',
            callbackURL: 'http://localhost:3000/api/auth/yandex/callback', // local dev default
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
