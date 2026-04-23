import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-mailru';
import { AuthService } from '../auth.service';

@Injectable()
export class MailruStrategy extends PassportStrategy(Strategy, 'mailru') {
    constructor(private authService: AuthService) {
        const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
            ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
            : (process.env.BACKEND_URL || 'http://localhost:3000');

        super({
            clientID: process.env.MAILRU_CLIENT_ID,
            clientSecret: process.env.MAILRU_CLIENT_SECRET,
            callbackURL: process.env.MAILRU_CALLBACK_URL || `${baseUrl}/api/auth/mailru/callback`,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { id, emails, name, photos } = profile;
        const user = await this.authService.validateOAuthUser({
            email: emails?.[0]?.value,
            firstName: name?.givenName || profile.first_name,
            lastName: name?.familyName || profile.last_name,
            avatarUrl: photos?.[0]?.value || profile.image,
            provider: 'mailru',
            providerId: id,
        });
        done(null, user);
    }
}
