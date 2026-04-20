import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    private readonly logger = new Logger(MailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.yandex.ru',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationCode(email: string, code: string) {
        const from = process.env.SMTP_FROM || `"Походный Сборщик" <${process.env.SMTP_USER}>`;
        
        try {
            await this.transporter.sendMail({
                from,
                to: email,
                subject: 'Код подтверждения регистрации — Походный Сборщик',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                        <h2 style="color: #2F80ED; text-align: center;">Добро пожаловать в Походный Сборщик! 🏔</h2>
                        <p>Вы начали процесс регистрации. Используйте этот код, чтобы подтвердить ваш адрес электронной почты:</p>
                        <div style="background: #f4f7fa; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">Код действителен в течение 10 минут. Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="text-align: center; color: #999; font-size: 12px;">© 2024 Походный Сборщик — Ваш планировщик приключений</p>
                    </div>
                `,
            });
            this.logger.log(`Verification code sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
            throw error;
        }
    }
}
