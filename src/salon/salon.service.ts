import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity của Salon
import { Salon } from './entities/salon.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateSalonDto } from './dto/createSalon.dto';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createSalonDto: CreateSalonDto): Promise<Salon> {
    const salon = this.salonRepository.create(createSalonDto);
    return this.salonRepository.save(salon);
  }

  async createSalonApi(body: any, file?: Express.Multer.File): Promise<Salon> {
    // Validate and parse openingHours
    let openingHours: Record<string, string> = {};
    try {
      openingHours =
        typeof body.openingHours === 'string'
          ? JSON.parse(body.openingHours)
          : body.openingHours || {};
    } catch (error) {
      console.error('Invalid openingHours JSON:', error);
      throw new Error('Invalid openingHours format. It must be a valid JSON string or object.');
    }
  
    // Validate latitude and longitude
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Latitude and longitude must be valid numbers.');
    }
  
    // Create the DTO
    const createSalonDto: CreateSalonDto = {
      name: body.name,
      address: body.address,
      lat,
      lng,
      openingHours, // Directly use the parsed object
    };
  
    // Handle image upload (optional)
    let imageUrl: string | undefined;
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Failed to upload image. Please try again.');
      }
    }
    // Create and save the salon entity
    try {
      return this.create({ ...createSalonDto, image: imageUrl });
    } catch (error) {
      console.error('Failed to create salon:', error);
      throw new Error('Error occurred while creating the salon.');
    }
  }
  
}
