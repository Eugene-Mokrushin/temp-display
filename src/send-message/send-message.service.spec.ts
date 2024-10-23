import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageService } from './send-message.service';
import { ConfigService } from '@nestjs/config';
import { ApiClientModule } from '../api-client/api-client.module';

describe('SendMessageService', () => {
  let service: SendMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiClientModule],
      providers: [SendMessageService, ConfigService],
    }).compile();

    service = module.get<SendMessageService>(SendMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
