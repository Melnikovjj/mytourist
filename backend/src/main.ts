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
            origin: (origin, callback) => {
                console.log('Incoming request from origin:', origin);
                if (!origin) return callback(null, true);

                const allowedOrigins = [
                    'https://web.telegram.org',
                    'http://localhost:3000',
                    'http://localhost:5173'
                ];

                // Allow Vercel deployments
                if (origin.endsWith('.vercel.app')) return callback(null, true);

                // Allow known origins
                if (allowedOrigins.includes(origin)) return callback(null, true);

                // Allow specific frontend
                if (origin === 'https://frontend-three-sandy-65.vercel.app') return callback(null, true);

                console.log('Allowed context-aware origin:', origin);
                callback(null, true);
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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

        // Add simple health check for Railway (binds to root /)
        const httpAdapter = app.getHttpAdapter();
        httpAdapter.get('/', (req, res) => {
            console.log('GET / health check hit');
            res.send('OK');
        });

        // Add logging middleware to see if requests reach us
        app.use((req: any, res: any, next: any) => {
            console.log(`Request: ${req.method} ${req.url}`);
            next();
        });

        const port = parseInt(process.env.PORT || '3000', 10);
        console.log(`Attempting to listen on port ${port} (::)...`);
        await app.listen(port, '::');
        console.log(`🚀 Server running on port ${port}`);
    } catch (error) {
        console.error('❌ Error starting NestJS application:', error);
        process.exit(1);
    }
}

bootstrap();
