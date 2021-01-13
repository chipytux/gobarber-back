import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import mailgunAuth from 'nodemailer-mailgun-transport';
import mailConfig from '@config/Mail';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class MailgunProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const auth = {
      auth: {
        api_key: process.env.MAILGUN_API || '',
        domain: process.env.MAILGUN_DOMAIN,
      },
    };

    this.client = nodemailer.createTransport(mailgunAuth(auth));
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@linketrack.com',
      },
      to: { name: to.name, address: to.email },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
