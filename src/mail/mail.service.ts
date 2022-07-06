import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Config } from '../constants';
import { IUser } from '../user/types/user.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: IUser, code: string) {
    const url = `${Config.baseUrl}/auth/confirm?code=${code}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Malpen Bank! Confirm your Email',
      template: './confirmation',
      context: {
        name: 'User',
        url,
      },
    });
  }

  async sendOperationCode(user: IUser, code: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Malpen Bank! Confirm your operation',
      template: './operation',
      context: {
        name: 'User',
        code,
      },
    });
  }
}