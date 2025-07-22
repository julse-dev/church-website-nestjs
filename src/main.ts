import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API 설명')
    .setVersion('1.0')
    .addTag('users')
    .build();

  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // 모든 API 엔드포인트에 /api 접두사 추가
  app.setGlobalPrefix('api');

  // DTO 유효성 검사
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
