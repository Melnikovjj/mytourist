import { PassportStrategy } from '@nestjs/passport';
// @ts-ignore
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        let baseUrl = process.env.WEBAPP_URL 
            || 'https://websborpohod.tech';
        baseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slash

        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id_for_dev',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
            callbackURL: `${baseUrl}/api/auth/google/callback`,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { name, emails, id, photos } = profile;
        const userPayload = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatarUrl: photos[0]?.value,
            provider: 'google',
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
