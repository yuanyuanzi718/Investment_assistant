import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许前端跨域请求（MVP 阶段必需）
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // 后端改用 3001，避免跟 Next 冲突
  await app.listen(3001);
}
bootstrap();
