import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Configurar CORS
  app.enableCors({
    origin: true, // Configure conforme necessário
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new TransformInterceptor());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Your Tale API')
    .setDescription('API para gerenciamento de sessões de RPG e narrativas colaborativas')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('sessions', 'Gerenciamento de sessões de RPG')
    .addTag('characters', 'Gerenciamento de personagens')
    .addTag('notes', 'Gerenciamento de anotações')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Your Tale API Documentation',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
