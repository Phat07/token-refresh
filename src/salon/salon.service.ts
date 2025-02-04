import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity của Salon
import { Salon } from './entities/salon.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateSalonDto } from './dto/createSalon.dto';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createSalonDto: CreateSalonDto): Promise<Salon> {
    const salon = this.salonRepository.create(createSalonDto);
    return this.salonRepository.save(salon);
  }

  async createSalonApi(body: any, file?: Express.Multer.File): Promise<Salon> {
    // Validate và parse openingHours
    let openingHours: Record<string, string> = {};
    try {
      openingHours =
        typeof body.openingHours === 'string'
          ? JSON.parse(body.openingHours)
          : body.openingHours || {};
    } catch (error) {
      console.error('Invalid openingHours JSON:', error);
      throw new Error(
        'Invalid openingHours format. It must be a valid JSON string or object.',
      );
    }

    // Validate latitude và longitude
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Latitude and longitude must be valid numbers.');
    }

    // Xử lý upload hình ảnh lên Cloudinary (nếu có)
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

    // Tạo Salon DTO
    const createSalonDto: CreateSalonDto = {
      name: body.name,
      address: body.address,
      lat,
      lng,
      openingHours, // Lưu giữ giờ mở cửa
      image: imageUrl,
    };

    // Tạo Salon
    let salon: Salon;
    try {
      salon = await this.salonRepository.save(
        this.salonRepository.create(createSalonDto),
      );
    } catch (error) {
      console.error('Failed to create salon:', error);
      throw new Error('Error occurred while creating the salon.');
    }

    // Tạo lịch làm việc (Schedule) cho mỗi ngày có trong openingHours
    const daysOfWeek = Object.keys(openingHours);
    const schedules = daysOfWeek.map((day) => {
      const [startTime, endTime] = openingHours[day].split('-');

      return this.scheduleRepository.create({
        salon: salon, // Gán salon vào schedule
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1), // Chuyển chữ thường thành chữ hoa đầu
        startTime,
        endTime,
        isActive: true, // Lịch làm việc mặc định là đang hoạt động
      });
    });

    try {
      await this.scheduleRepository.save(schedules);
    } catch (error) {
      console.error('Failed to create schedules:', error);
      throw new Error('Error occurred while creating schedules.');
    }

    return salon;
  }
}
