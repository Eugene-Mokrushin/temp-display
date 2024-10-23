import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';
import * as TelegramBot from 'node-telegram-bot-api';
import { RequestDto } from '../dto/request.dto';
import { ApiClientService } from '../api-client/api-client.service';

@Injectable()
export class SendMessageService {
  private bot!: TelegramBot;
  constructor(
    private configService: ConfigService,
    private apiClient: ApiClientService,
  ) {
    this.bot = new TelegramBot(this.configService.get('TELEGRAM_TOKEN'), {
      polling: false,
    });
  }
  async onMessage(dto: RequestDto) {
    const chatId = dto.original_message.message.chat.id;
    const text = dto.text;

    if (dto.options === 'AuthRequest') {
      this.sendMessageAuthRequest(chatId, text);
    } else {
      if (dto.options === 'OkCancel') {
        await this.sendMessageOkCancel(chatId, text);
      } else if (dto.options === 'WebView') {
        await this.sendMessage(chatId, text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: dto.params?.buttonText,
                  web_app: { url: dto.params?.webAppUrl },
                },
              ],
            ],
          },
        });
      } else {
        await this.sendMessageAndCleanMenu(chatId, text);
      }
      dto.files?.forEach(async (filename: string) => {
        const file = await this.apiClient.getFile(filename);
        await this.sendFile(chatId, file, {
          filename,
        });
      });
      dto.photos?.forEach(async (photo: string) => {
        const photoBuff = Buffer.from(photo, 'base64');
        await this.sendPhoto(chatId, photoBuff);
      });
    }
  }
  private async sendMessage(
    chatId: number,
    text: string,
    options?: TelegramBot.SendMessageOptions,
  ): Promise<void> {
    if (!text) return;
    await this.bot.sendMessage(chatId, text, options);
  }
  private async sendMessageAndCleanMenu(
    chatId: number,
    text: string,
  ): Promise<void> {
    const options: TelegramBot.SendMessageOptions = {
      parse_mode: 'Markdown',
      reply_markup: {
        remove_keyboard: true,
      },
    };
    await this.sendMessage(chatId, text, options);
  }
  private async sendMessageOkCancel(
    chatId: number,
    text: string,
  ): Promise<void> {
    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Да',
            },
            {
              text: 'Нет',
            },
          ],
        ],
      },
    };
    await this.sendMessage(chatId, text, options);
  }
  private async sendMessageAuthRequest(
    chatId: number,
    text: string,
  ): Promise<void> {
    const options: TelegramBot.SendMessageOptions = {
      parse_mode: 'Markdown',
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Авторизоваться',
              request_contact: true,
            },
          ],
          [
            {
              text: 'Отменить',
            },
          ],
        ],
      },
    };

    await this.sendMessage(chatId, text, options);
  }
  private async sendPhoto(chatId: number, photo: Buffer): Promise<void> {
    await this.bot.sendPhoto(chatId, photo);
  }
  private async sendFile(
    chatId: number,
    file: string | Buffer,
    fileOptions?: TelegramBot.FileOptions,
    options?: TelegramBot.SendDocumentOptions,
  ) {
    if (!file) return;

    const contentType = mime.lookup(fileOptions.filename);
    if (!fileOptions.contentType && contentType) {
      fileOptions.contentType = contentType;
    }
    await this.bot.sendDocument(chatId, file, options, fileOptions);
  }
}
