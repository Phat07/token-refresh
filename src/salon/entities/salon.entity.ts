import { Employee } from 'src/employee/entities/employee.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity('salon')
export class Salon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  image: string; // Cloudinary URL

  @OneToMany(() => Schedule, (schedule) => schedule.salon)
  schedules: Schedule[];

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  // Quan hệ với Service
  @OneToMany(() => Service, (service) => service.salon)
  services: Service[];

  // Quan hệ với Voucher
  @OneToMany(() => Voucher, (voucher) => voucher.salon)
  vouchers: Voucher[];

  @OneToMany(() => Employee, (employee) => employee.salon)
  employees: Employee[];

  @ManyToOne(() => Owner, (owner) => owner.salons)
  owner: Employee[];
  // @ManyToOne(() => User, (user) => user.salons)
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}
