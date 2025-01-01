import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/createService';
import { Service } from './entities/service.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createService(
    body: CreateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    // Kiểm tra salon có tồn tại không
    const salon = await this.salonRepository.findOne({
      where: { id: body.salonId },
    });

    if (!salon) {
      throw new BadRequestException(
        'Salon không tồn tại. Vui lòng kiểm tra lại!',
      );
    }

    if (!body.name || body.name.trim() === '') {
      throw new BadRequestException('Tên dịch vụ không được để trống.');
    }

    if (body.price < 0) {
      throw new BadRequestException('Giá dịch vụ không được nhỏ hơn 0.');
    }

    if (body.duration <= 0) {
      throw new BadRequestException('Thời gian dịch vụ phải lớn hơn 0.');
    }

    // Nếu có file (hình ảnh) thì xử lý tại đây
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

    // Tạo service mới
    const service = this.serviceRepository.create({
      name: body.name,
      price: body.price,
      description: body.description,
      duration: body.duration,
      salon: salon,
      status: true,
      image: imageUrl, // Thêm thuộc tính nếu cần
    });

    return this.serviceRepository.save(service);
  }

  async getServicesBySalon(salonId: string, page: number, limit: number) {
    const skip = (page - 1) * limit; // Tính số bản ghi cần bỏ qua

    // Lấy danh sách dịch vụ theo salonId với phân trang
    const [services, total] = await this.serviceRepository.findAndCount({
      where: { salon: { id: salonId } },
      relations: ['salon'],
      skip, // Số lượng bản ghi cần bỏ qua
      take: limit, // Số lượng bản ghi cần lấy
      order: { name: 'ASC' }, // Tùy chọn: Sắp xếp theo tên dịch vụ
    });

    return {
      data: services, // Danh sách dịch vụ
      total, // Tổng số bản ghi
      currentPage: page, // Trang hiện tại
      totalPages: Math.ceil(total / limit), // Tổng số trang
    };
  }

  async updateService(
    id: string,
    updateData: Partial<CreateServiceDto>, // Use CreateServiceDto as a base
    file?: Express.Multer.File, // Optional file upload
  ): Promise<Service> {
    // Find the service by ID
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new BadRequestException('Dịch vụ không tồn tại!');
    }

    // Check if the salon exists (using the salon ID from the DTO if necessary)
    if (updateData.salonId) {
      const salon = await this.salonRepository.findOne({
        where: { id: updateData.salonId },
      });

      if (!salon) {
        throw new BadRequestException(
          'Salon không tồn tại. Vui lòng kiểm tra lại!',
        );
      }
      service.salon = salon;
    }

    // Validate fields before updating
    if (updateData.name && updateData.name.trim() === '') {
      throw new BadRequestException('Tên dịch vụ không được để trống.');
    }

    if (updateData.price !== undefined && updateData.price < 0) {
      throw new BadRequestException('Giá dịch vụ không được nhỏ hơn 0.');
    }

    if (updateData.duration !== undefined && updateData.duration <= 0) {
      throw new BadRequestException('Thời gian dịch vụ phải lớn hơn 0.');
    }

    // Handle image update if a file is provided
    let imageUrl: string | undefined;
    if (file) {
      try {
        if (service.image) {
          // Delete the old image using the public ID stored earlier
          const currentImagePublicId = service.image
            .split('/')
            .pop()
            ?.split('.')[0]; // Extract public ID from URL
          if (currentImagePublicId) {
            await this.cloudinaryService.deleteImage(currentImagePublicId);
          }
        }
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Failed to upload image. Please try again.');
      }
    }

    // Update the service with the provided fields (this will update only the fields that were passed)
    if (updateData.name) service.name = updateData.name;
    if (updateData.price !== undefined) service.price = updateData.price;
    if (updateData.description) service.description = updateData.description;
    if (updateData.duration !== undefined)
      service.duration = updateData.duration;
    if (imageUrl) service.image = imageUrl;
    // Save the updated service
    return this.serviceRepository.save(service);
  }

  async deleteService(id: string) {
    // Tìm kiếm dịch vụ theo ID
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new BadRequestException('Dịch vụ không tồn tại');
    }

    // Cập nhật trạng thái `status` thành `false`
    service.status = false;

    // Lưu lại thay đổi
    return this.serviceRepository.save(service);
  }
}
