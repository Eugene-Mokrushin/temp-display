import { Body, Controller, Post } from '@nestjs/common';
import { RequestDto } from '../dto/request.dto';
import { SendMessageService } from './send-message.service';

@Controller('/api/v2/telegram/send_message')
export class SendMessageController {
  constructor(private readonly sendMessageService: SendMessageService) {}
  @Post()
  onMessage(@Body() dto: RequestDto) {
    return this.sendMessageService.onMessage(dto);
  }
}
