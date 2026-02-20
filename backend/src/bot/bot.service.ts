import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BotService implements OnModuleInit {
    private bot: Telegraf;
    private readonly logger = new Logger(BotService.name);

    constructor(private prisma: PrismaService) {
        const token = process.env.BOT_TOKEN;
        if (token && token !== 'YOUR_BOT_TOKEN_FROM_BOTFATHER') {
            this.bot = new Telegraf(token);
        }
    }

    async onModuleInit() {
        if (!this.bot) {
            this.logger.warn('BOT_TOKEN not set — bot disabled');
            return;
        }

        this.bot.command('start', async (ctx) => {
            const webAppUrl = process.env.WEBAPP_URL || 'https://yourdomain.com';
            const payload = ctx.payload; // telegraf parses '/start payload' into ctx.payload

            let url = webAppUrl;
            if (payload) {
                // If payload exists, pass it as query param so frontend can read it
                // We use 'start_param' to match Telegram's native naming convention
                url += `?start_param=${payload}`;
            }

            await ctx.reply(
                '🏔 Добро пожаловать в «Походный Сборщик»!\n\nПланируйте походы, управляйте снаряжением и питанием вместе с командой.',
                Markup.inlineKeyboard([
                    Markup.button.webApp('🎒 Открыть приложение', url),
                ]),
            );
        });

        this.bot.command('my_projects', async (ctx) => {
            const telegramId = BigInt(ctx.from.id);
            const user = await this.prisma.user.findUnique({
                where: { telegramId },
            });

            if (!user) {
                await ctx.reply('Вы ещё не зарегистрированы. Откройте приложение для начала работы.');
                return;
            }

            const memberships = await this.prisma.projectMember.findMany({
                where: { userId: user.id },
                include: { project: true },
            });

            if (memberships.length === 0) {
                await ctx.reply('У вас пока нет проектов. Создайте первый в приложении! 🏕');
                return;
            }

            const lines = memberships.map((m, i) => {
                const emoji = m.project.type === 'hiking' ? '🥾' : m.project.type === 'ski' ? '⛷' : '🚣';
                return `${i + 1}. ${emoji} ${m.project.title} (${m.role})`;
            });

            await ctx.reply(`📋 Ваши проекты:\n\n${lines.join('\n')}`);
        });

        this.bot.launch().then(() => {
            this.logger.log('🤖 Telegram bot launched');
        }).catch((error) => {
            this.logger.error('Failed to launch bot:', error);
        });
        // this.logger.warn('⚠️ Bot launch SKIPPED for debugging 502 error');
    }

    async sendNotification(telegramId: bigint, message: string, inviteCode?: string | null) {
        if (!this.bot) return;
        try {
            const options: any = { parse_mode: 'HTML' };

            if (inviteCode) {
                // We use a regular URL button pointing to the Telegram deep link. 
                // Using .webApp() with a t.me link breaks initData inheritance and forces test-user credentials.
                const botUsername = this.bot.botInfo?.username || 'TuristProPlanner_bot';
                Object.assign(options, Markup.inlineKeyboard([
                    Markup.button.url('💬 Ответить в чате', `https://t.me/${botUsername}/app?startapp=proj_${inviteCode}`)
                ]));
            }

            await this.bot.telegram.sendMessage(telegramId.toString(), message, options);
        } catch (error) {
            this.logger.error(`Failed to send notification to ${telegramId}:`, error);
        }
    }

    async sendProjectInvite(telegramId: bigint, projectTitle: string, inviteCode: string) {
        if (!this.bot) return;
        const webAppUrl = process.env.WEBAPP_URL || 'https://yourdomain.com';
        try {
            await this.bot.telegram.sendMessage(
                telegramId.toString(),
                `🎒 Вас пригласили в поход «${projectTitle}»!\n\nКод приглашения: <code>${inviteCode}</code>`,
                {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        Markup.button.webApp('Присоединиться', `${webAppUrl}?invite=${inviteCode}`),
                    ]),
                },
            );
        } catch (error) {
            this.logger.error(`Failed to send invite to ${telegramId}:`, error);
        }
    }
}
