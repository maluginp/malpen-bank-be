import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET
      },
      {
        path: '/site/**',
        method: RequestMethod.GET
      }
    ],
  });

  await app.listen(8888);
}
bootstrap();
