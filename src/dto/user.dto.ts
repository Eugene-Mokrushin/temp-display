import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;
  @Expose()
  first_name: string;
  @Expose()
  middle_name: string;
  @Expose()
  last_name: string;
  @Expose()
  telegram_id: number;
}

export class CreateUserDto {
  @Expose()
  public email!: string;

  @Expose()
  public telegram_id?: number;

  @Expose()
  public verification_code?: string;

  @Expose()
  public phone_number?: string;
}
