import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 예외 필터
  app.useGlobalFilters(new AllExceptionsFilter());

  // 전역 로깅 인터셉터
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 보안 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Church Website API')
    .setDescription('교회 웹사이트 백엔드 API')
    .setVersion('1.0')
    .addTag('auth', '인증 관련 API')
    .addTag('user', '사용자 관련 API')
    .addTag('church-news-boards', '게시판 관련 API')
    .build();

  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // CORS 설정 개선
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com'] // 프로덕션 도메인 설정
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 모든 API 엔드포인트에 /api 접두사 추가
  app.setGlobalPrefix('api');

  // DTO 유효성 검사 강화
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true, // 정의되지 않은 속성 차단
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api-docs`);
}
bootstrap();
