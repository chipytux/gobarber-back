import { container } from 'tsyringe';
import mailConfig from '@config/Mail';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import MailgunProvider from './implementations/MailgunProvider';
import IMailProvider from './models/IMailProvider';

const mailProvider = {
  mailgun: container.resolve(MailgunProvider),
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProvider[mailConfig.driver],
);
