import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { createReadStream } from 'fs';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'salons',
          transformation: [{ width: 800, height: 600, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
  
      if (file.path) {
        // Disk storage: Use createReadStream
        createReadStream(file.path).pipe(uploadStream);
      } else if (file.buffer) {
        // Memory storage: Use file.buffer
        uploadStream.end(file.buffer);
      } else {
        reject(new Error('File is missing both path and buffer'));
      }
    });
  }
  

  // Thêm method xóa ảnh nếu cần
  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
