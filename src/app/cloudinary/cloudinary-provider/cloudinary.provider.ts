import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  useFactory: (config: ConfigService) => {
    return cloudinary.config({
      cloud_name: config.getOrThrow<string>('CLOUDINARY_NAME'),
      api_key: config.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  },
  inject: [ConfigService],
};
