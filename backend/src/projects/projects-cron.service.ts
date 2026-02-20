import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import { BotService } from '../bot/bot.service';

@Injectable()
export class ProjectsCronService {
    private readonly logger = new Logger(ProjectsCronService.name);

    constructor(
        private prisma: PrismaService,
        private botService: BotService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCompletedProjects() {
        this.logger.debug('Checking for recently completed projects...');
        const now = new Date();

        const completedProjects = await this.prisma.project.findMany({
            where: {
                isCompleted: false,
                endDate: { lt: now } // Project has ended
            },
            include: {
                members: { include: { user: true } }
            }
        });

        if (completedProjects.length === 0) return;

        this.logger.log(`Found ${completedProjects.length} completed projects. Sending notifications.`);

        for (const project of completedProjects) {
            // Update the database first to prevent duplicate sends on failure
            await this.prisma.project.update({
                where: { id: project.id },
                data: { isCompleted: true }
            });

            // Send standard notification to every member
            for (const member of project.members) {
                if (member.user.telegramId) {
                    const notifyText = `🎉 <b>Поход завершен!</b>\n\nПоздравляем с успешным завершением похода «${project.title}»! Надеемся, вы отлично провели время.\n\nЗайдите в приложение, чтобы поделиться впечатлениями или спланировать новое приключение!`;
                    try {
                        await this.botService.sendNotification(member.user.telegramId, notifyText, project.inviteCode);
                    } catch (error) {
                        this.logger.error(`Failed to notify user ${member.user.telegramId} about project ${project.id}:`, error);
                    }
                }
            }
        }
    }
}
