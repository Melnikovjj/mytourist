import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log('Starting bootstrap...');
    try {
        const app = await NestFactory.create(AppModule);
        console.log('Nest application created.');

        app.setGlobalPrefix('api');
        app.enableCors({
            origin: [
                process.env.WEBAPP_URL || 'http://localhost:5173',
                'https://web.telegram.org',
                /\.vercel\.app$/,
                '*'
            ],
            credentials: true,
        });

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: false,
                transform: true,
            }),
        );

        const config = new DocumentBuilder()
            .setTitle('Походный Сборщик API')
            .setDescription('Hiking Planner API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);

        const port = process.env.PORT || 3000;
        console.log(`Attempting to listen on port ${port}...`);
        await app.listen(port, '0.0.0.0');
        console.log(`🚀 Server running on port ${port}`);
    } catch (error) {
        console.error('❌ Error starting NestJS application:', error);
        process.exit(1);
    }
}

bootstrap();
