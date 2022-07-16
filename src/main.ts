import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import fs from 'fs';
import http from 'http'
import https from 'https'
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.HTTPS_PRIVATE_KEY || join(__dirname, '../cert/private_key.pem')),
    cert: fs.readFileSync(process.env.HTTPS_PUBLIC_CERT || join(__dirname, '../cert/public_cert.pem')),
  };
  const server = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {
      cors: true
    }
  );
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

  await app.init();

  http.createServer(server).listen(process.env.HTTP_PORT || 8888);
  https.createServer(httpsOptions, server).listen(process.env.HTTPS_PORT || 443);
}
bootstrap();
