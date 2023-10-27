import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  app.enableCors({
    origin: ['https://tattoo-client.onrender.com/'],
  });
  app.use(
    graphqlUploadExpress({
      maxFileSize: 1000000,
      maxFiles: 10,
    }),
  );
  await app.listen(3000);
}
bootstrap();
