import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/common/types/response.type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');
export type MulterFileType = Express.Multer.File;
@Injectable()
export class CloudinaryService {
  uploadSingleFile(file: MulterFileType): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: 'comictoon' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
