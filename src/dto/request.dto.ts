import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MessageDto } from './message.dto';
import { UserDto } from './user.dto';

export enum TelegramSendMessageOptions {
  OkCancel = 'OkCancel',
  AuthRequest = 'AuthRequest',
  WebView = 'WebView',
}

export class Intents {
  @Expose()
  displayName: string;
}

export class QueryResults {
  @Expose()
  @Type(() => Intents)
  @ValidateNested({ each: true })
  public intent: Intents;

  @Expose()
  public fulfillmentText: string;
}

export class RequestDto {
  @Expose()
  public text!: string;

  @Expose()
  public files?: string[];

  @Expose()
  public options?: TelegramSendMessageOptions;

  @Expose()
  public params?: any;

  @Expose()
  public queryResult?: QueryResults;

  @Expose()
  public label?: string;

  @Expose()
  public photos?: string[];

  @Expose()
  public original_message: MessageDto;

  @Expose()
  public user?: UserDto;
}
