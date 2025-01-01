import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Salon } from '../salon/entities/salon.entity';
import { Service } from '../service/entities/service.entity';
import { CreateEmployeeDto } from './dto/createEmployee';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateEmployeeDto } from './dto/updateEmployee';
import { UsersService } from 'src/users/services/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/roles/enums/role.enum';
import { CreateEmployeeGmailDto } from './dto/createEmployeeGmail';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private cloudinaryService: CloudinaryService,
    private userService: UsersService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async register(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { username, gender, salonId, serviceIds, workSchedule } =
      createEmployeeDto;

    // Verify the salon exists
    const salon = await this.salonRepository.findOne({
      where: { id: salonId },
    });
    if (!salon) {
      throw new BadRequestException('Salon does not exist.');
    }

    // Verify the services exist
    let services = [];
    if (serviceIds && serviceIds.length > 0) {
      services = await this.serviceRepository.findByIds(serviceIds);
      if (services.length !== serviceIds.length) {
        throw new BadRequestException('One or more services do not exist.');
      }
    }

    // Transform the workSchedule into the expected type if necessary
    const transformedSchedule = workSchedule
      ? {
          monday: workSchedule.monday || null,
          tuesday: workSchedule.tuesday || null,
          wednesday: workSchedule.wednesday || null,
          thursday: workSchedule.thursday || null,
          friday: workSchedule.friday || null,
          saturday: workSchedule.saturday || null,
          sunday: workSchedule.sunday || null,
        }
      : null;

    // Create a new employee
    const newEmployee = this.employeeRepository.create({
      image: null,
      username,
      gender,
      salon,
      services,
      workSchedule: transformedSchedule, // Pass the properly structured workSchedule
    });

    return this.employeeRepository.save(newEmployee);
  }

  async updateEmployee(
    id: string,
    updateData: Partial<UpdateEmployeeDto>,
    file?: Express.Multer.File,
  ): Promise<Employee> {
    // Find the existing employee
    const employee = await this.employeeRepository.findOne({
      where: { id: id },
      relations: ['salon', 'services'], // Include relations if necessary
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    // If a new image is provided, upload it to Cloudinary
    let newImageUrl: string | undefined;
    if (file) {
      try {
        // Remove the old image if it exists
        if (employee.image) {
          const currentImagePublicId = employee.image
            .split('/')
            .pop()
            ?.split('.')[0]; // Extract public ID from URL
          await this.cloudinaryService.deleteImage(currentImagePublicId);
        }
        // Upload the new image
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        newImageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Image upload failed:', error);
        throw new BadRequestException('Failed to upload image');
      }
    }

    // Update properties from the updateData DTO
    if (updateData.username) {
      employee.username = updateData.username;
    }

    if (updateData.gender) {
      employee.gender = updateData.gender;
    }

    if (updateData.workSchedule) {
      employee.workSchedule = {
        ...employee.workSchedule, // Retain existing schedule if not overwritten
        ...updateData.workSchedule,
      };
    }

    if (updateData.salonId) {
      const salon = await this.salonRepository.findOne({
        where: { id: updateData.salonId },
      });
      if (!salon) {
        throw new BadRequestException('Salon not found');
      }
      employee.salon = salon;
    }

    if (updateData.serviceIds) {
      const services = await this.serviceRepository.findByIds(
        updateData.serviceIds,
      );
      if (services.length !== updateData.serviceIds.length) {
        throw new BadRequestException('One or more services do not exist');
      }
      employee.services = services;
    }

    // Assign the new image URL if available
    if (newImageUrl) {
      employee.image = newImageUrl;
    }
    // Save the updated employee
    return this.employeeRepository.save(employee);
  }

  async activateEmployeeAccount(requestBody: CreateEmployeeGmailDto) {
    // 1. Kiểm tra Employee tồn tại
    const employee = await this.employeeRepository.findOne({
      where: { id: requestBody.employeeId },
      relations: ['user'], // Bao gồm thông tin user để kiểm tra
    });

    if (!employee) {
      throw new BadRequestException('Employee not found!');
    }

    // 2. Kiểm tra nếu Employee đã có tài khoản User
    if (employee.user) {
      throw new BadRequestException('Employee already has an account!');
    }

    // 3. Kiểm tra email có tồn tại trong bảng User
    const existingUser = await this.userRepository.findOne({
      where: { email: requestBody.gmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists!');
    }

    // 4. Tạo User mới với role là "EMPLOYEE"
    const hashedPassword = await bcrypt.hash('defaultPassword123', 10); // Mật khẩu mặc định, có thể yêu cầu đổi sau
    const role = await this.roleRepository.findOne({
      where: { role: UserRole.EMPLOYEE },
    });

    if (!role) {
      throw new BadRequestException('Role not found!');
    }
    const newUser = this.userRepository.create({
      email: requestBody.gmail,
      name: employee.username, // Hoặc lấy từ thông tin Employee
      password: hashedPassword,
      role: role, // Vai trò nhân viên
    });

    const savedUser = await this.userRepository.save(newUser);

    // 5. Gắn User vừa tạo vào Employee
    employee.user = savedUser;
    const updatedEmployee = await this.employeeRepository.save(employee);

    return {
      msg: 'Employee account has been activated!',
      data: {
        employeeId: updatedEmployee.id,
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }
}
