import { Salon } from 'src/salon/entities/salon.entity';
import { Service } from 'src/service/entities/service.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EnumGender } from '../enums/gender.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

 @Column({
    type: 'enum',
    enum: EnumGender,
    default: EnumGender.OTHER
  })
  gender: EnumGender;

  @Column({ nullable: true })
  image: string; // Employee image (could be a URL from Cloudinary)

  // Work schedule from Monday to Sunday (you can adjust this based on your needs)
  @Column({ type: 'json', nullable: true })
  workSchedule: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  
  // Relation to Salon
  @ManyToOne(() => Salon, (salon) => salon.employees)
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn({ name: 'userId' }) // Tạo cột userId trong bảng Employee
  user: User;

  @Column({ nullable: true })
  userId: string;

  // Relation to Services (many-to-many, an employee can perform multiple services)
  @ManyToMany(() => Service, (service) => service.employees)
  @JoinTable({
    name: 'employee_services',
    joinColumn: { name: 'employeeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'serviceId', referencedColumnName: 'id' },
  })
  services: Service[];


  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}