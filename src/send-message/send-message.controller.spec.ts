import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageController } from './send-message.controller';
import { SendMessageService } from './send-message.service';
import { ConfigService } from '@nestjs/config';
import { ApiClientModule } from '../api-client/api-client.module';

describe('SendMessageController', () => {
  let controller: SendMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiClientModule],
      controllers: [SendMessageController],
      providers: [SendMessageService, ConfigService],
    }).compile();

    controller = module.get<SendMessageController>(SendMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
