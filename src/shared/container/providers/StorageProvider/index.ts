import { container } from 'tsyringe';
import uploadConfig from '@config/Upload';
import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const storageProvider = {
  s3: container.resolve(S3StorageProvider),
  disk: container.resolve(DiskStorageProvider),
};

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  storageProvider[uploadConfig.driver],
);
