import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ProjectsCronService } from './src/projects/projects-cron.service';
import { PrismaService } from './src/common/prisma/prisma.service';

async function run() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const cron = app.get(ProjectsCronService);
    const prisma = app.get(PrismaService);

    console.log('--- Triggering Cron Job Manually ---');
    try {
        await cron.handleCompletedProjects();
        console.log('Cron job execution finished.');
    } catch (err) {
        console.error('Error during cron execution:', err);
    }

    await app.close();
    process.exit(0);
}

run();
