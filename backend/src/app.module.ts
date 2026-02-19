import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MealsModule } from './meals/meals.module';
import { WeightModule } from './weight/weight.module';
import { ChecklistModule } from './checklist/checklist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BotModule } from './bot/bot.module';
import { EventsGateway } from './gateway/events.gateway';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
        PrismaModule,
        AuthModule,
        UsersModule,
        ProjectsModule,
        EquipmentModule,
        MealsModule,
        WeightModule,
        ChecklistModule,
        NotificationsModule,
        BotModule,
        MessagesModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        EventsGateway,
    ],
})
export class AppModule { }
