import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/Upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePah = path.resolve(uploadConfig.uploadFolder, file);
    try {
      await fs.promises.stat(filePah);
    } catch {
      return;
    }

    await fs.promises.unlink(filePah);
  }
}

export default DiskStorageProvider;
