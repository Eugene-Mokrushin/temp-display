export class MessageDto {
  update_id: number;
  message: {
    contact: {
      phone_number: string;
      first_name: string;
      last_name: string;
      vcard: string;
      user_id: number;
    };
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text?: string;
    voice?: {
      duration: number;
      mime_type: string;
      file_id: string;
      file_unique_id: string;
      file_size: number;
    };
  };
}
