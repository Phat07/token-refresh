import { Employee } from 'src/employee/entities/employee.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity('employee_schedule')
export class EmployeeSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
  dayOfWeek: string;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Cột salonId để dễ dàng truy vấn
  @Column({ type: 'uuid' })
  salonId: string;

  // Liên kết với Salon
  @ManyToOne(() => Salon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column({ type: 'uuid' })
  employeeId: string;

  // Liên kết với Employee
  @ManyToOne(() => Employee, (employee) => employee.employeeSchedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
