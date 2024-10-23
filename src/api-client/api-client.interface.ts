import { ResponseType } from 'axios';

export interface ApiClientOptions {
  maxTries: number;
  timeout: number;
  accessToken?: string;
  contentType?: string;
  responseType?: ResponseType;
}
