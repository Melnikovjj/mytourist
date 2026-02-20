import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsCronService } from './projects-cron.service';
import { BotModule } from '../bot/bot.module';

@Module({
    imports: [BotModule],
    controllers: [ProjectsController],
    providers: [ProjectsService, ProjectsCronService],
    exports: [ProjectsService],
})
export class ProjectsModule { }
