import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SendMessageModule } from './send-message/send-message.module';

@Module({
  imports: [SendMessageModule],
  controllers: [AppController],
})
export class AppModule {}
