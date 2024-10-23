import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMessageService } from './send-message.service';
import { SendMessageController } from './send-message.controller';
import { ApiClientModule } from '../api-client/api-client.module';
@Module({
  imports: [ApiClientModule],
  controllers: [SendMessageController],
  providers: [SendMessageService, ConfigService],
})
export class SendMessageModule {}
