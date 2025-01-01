import { Employee } from 'src/employee/entities/employee.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  duration?: number; // Thời gian dịch vụ (phút)

  @Column({ nullable: true })
  status?: boolean; // Thời gian dịch vụ (phút)

  @Column({ nullable: true })
  image: string; // Cloudinary URL
  
  @ManyToOne(() => Salon, (salon) => salon.services)
  @JoinColumn({ name: 'salon_id' })
  salon: Salon;

  @ManyToMany(() => Employee, employee => employee.services)
  employees: Employee[];

  
  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}
