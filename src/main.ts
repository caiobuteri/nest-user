import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { createClient } from 'redis';

export const client = createClient();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await client.connect();
  await app.listen(3000);
}

bootstrap();
