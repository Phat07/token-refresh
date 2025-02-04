import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
  } from 'typeorm';
  import { v4 as uuidv4 } from 'uuid';
  import { Salon } from 'src/salon/entities/salon.entity';
  import { Employee } from 'src/employee/entities/employee.entity';
  
  @Entity('schedule')
  export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'date' })
    startDate: string;
  
    @Column({ type: 'date', nullable: true })
    endDate: string;
  
    @Column({ type: 'boolean', default: true })
    isActive: boolean;
  
    // Chỉ lưu một ngày cụ thể trong tuần
    @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
    dayOfWeek: string;
  
    // Thời gian làm việc
    @Column({ type: 'time' })
    startTime: string;
  
    @Column({ type: 'time' })
    endTime: string;
  
    // Relationship with Salon
    @ManyToOne(() => Salon, (salon) => salon.schedules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'salonId' })
    salon: Salon;
  
    // Relationship with Employee
    // @ManyToOne(() => Employee, (employee) => employee.schedules, { onDelete: 'CASCADE', nullable: true })
    // @JoinColumn({ name: 'employeeId' })
    // employee: Employee;
  
    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }
  }
  