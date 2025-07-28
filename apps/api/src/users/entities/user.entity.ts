import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { lengthMessage } from 'src/shared/messages/length.message';
import { emailMessage } from 'src/shared/messages/email.message';
import { UserRole, UserRoles } from '../constants/role.const';
import { EmailEntity } from 'src/emails/entities/email.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  @Length(1, 20, {
    message: lengthMessage,
  })
  username: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail(undefined, {
    message: emailMessage,
  })
  email: string;

  @Column()
  @IsString()
  @Length(3, 20, {
    message: lengthMessage,
  })
  @Exclude({
    toPlainOnly: true, // 응답에서만 제외됨 (backend DTO -> frontend plain object(JSON))
    toClassOnly: false, // 요청에서는 받아야 함 e.g. 회원가입 (frontend plain object(JSON) -> backend DTO)
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(UserRoles),
    default: UserRoles.None,
  })
  role: UserRole;

  @OneToMany(() => EmailEntity, (email) => email.user)
  emails: EmailEntity[];
}
