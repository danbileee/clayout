import { IsEmail, IsString, Length } from 'class-validator';
import { lengthMessage } from 'src/shared/messages/length.message';
import { emailMessage } from 'src/shared/messages/email.message';

export class LoginDto {
  @IsString()
  @IsEmail(undefined, {
    message: emailMessage,
  })
  email: string;

  @IsString()
  @Length(3, 20, {
    message: lengthMessage,
  })
  password: string;
}
