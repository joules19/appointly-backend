import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize the database schema
  // const databaseService = app.get(DatabaseService);
  // await databaseService.onModuleInit();

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
