import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { HttpModule } from '@nestjs/axios';
import { ApiClientModel } from './api-client.model';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService, ApiClientModel, ConfigService],
  exports: [ApiClientService, ApiClientModel],
})
export class ApiClientModule {}
