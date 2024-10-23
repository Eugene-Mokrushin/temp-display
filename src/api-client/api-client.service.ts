import { Injectable } from '@nestjs/common';
import { ApiClientModel } from './api-client.model';

@Injectable()
export class ApiClientService {
  constructor(private readonly api: ApiClientModel) {}
  async getFile(fileName: string): Promise<any> {
    return (
      await this.api.get(`files/${fileName}/_payload`, {
        timeout: 10000,
        maxTries: 3,
        responseType: 'arraybuffer',
        contentType: 'application/octet-stream',
      })
    ).context;
  }
}
