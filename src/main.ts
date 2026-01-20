import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ['log', 'fatal', 'error', 'warn', 'debug']
  });

  app.enableCors();
  app.use(helmet());

  const config = app.get(ConfigService);
  const basePath = config.get('BASE_PATH');
  const port = config.get('PORT');

  app.setGlobalPrefix(`${basePath}`);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  await app.listen(`${port}`);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

