import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiClientOptions } from './api-client.interface';
import { HTTP_METHODS } from './api-client.enum';
import * as jwt from 'jsonwebtoken';
import { generateToken } from '../sender/jwt';

@Injectable()
export class ApiClientModel {
  private apiGW: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiGW =
      'https://' + this.configService.get('GATEWAY_HOST') + '/api/v1';
  }

  private async sendRequest(
    method: HTTP_METHODS,
    resource: string,
    options: ApiClientOptions,
    body?: any,
  ) {
    const url = encodeURI(`${this.apiGW}/${resource}`);
    const params = this.generateParams(options);

    let tries = 0;
    while (tries < options.maxTries) {
      tries++;
      try {
        const res = await this.makeRequestBody(body, method, url, params);
        if (res.status <= 299)
          return { statusCode: res.status, context: res.data };
      } catch (err) {
        const status = err.response?.status || 502;
        const stopRetryCodes = [403, 429];
        if (stopRetryCodes.indexOf(status) != -1) {
          return { statusCode: status };
        } else if (tries >= options.maxTries) {
          console.log(err);
          return { statusCode: status };
        }
      }
    }
  }

  private async makeRequestBody(
    body: any,
    method: HTTP_METHODS,
    url: string,
    params,
  ) {
    return body
      ? await this.httpService.axiosRef[method](url, body, params)
      : await this.httpService.axiosRef[method](url, params);
  }

  private generateParams(options: ApiClientOptions) {
    const accessToken = options.accessToken
      ? options.accessToken
      : this.generateTechnicalToken();
    const params = {
      headers: { Authorization: 'Bearer ' + accessToken },
      timeout: options.timeout,
      'Content-Type': options.contentType
        ? options.contentType
        : 'application/json',
      responseType: options.responseType ? options.responseType : 'json',
    };
    return params;
  }

  generateTechnicalToken(): string {
    return generateToken();
  }

  async post(resource: string, body: any, options: ApiClientOptions) {
    return this.sendRequest(HTTP_METHODS.Post, resource, options, body);
  }
  async put(resource: string, body: any, options: ApiClientOptions) {
    return this.sendRequest(HTTP_METHODS.Put, resource, options, body);
  }
  async patch(resource: string, body: any, options: ApiClientOptions) {
    return this.sendRequest(HTTP_METHODS.Patch, resource, options, body);
  }
  async delete(resource: string, body: any, options: ApiClientOptions) {
    return this.sendRequest(HTTP_METHODS.Delete, resource, options, body);
  }
  async get(resource: string, options: ApiClientOptions) {
    return this.sendRequest(HTTP_METHODS.Get, resource, options);
  }
}
