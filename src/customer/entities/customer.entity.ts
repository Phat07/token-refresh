import { EnumGender } from 'src/employee/enums/gender.enum';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: EnumGender,
    default: EnumGender.OTHER,
  })
  gender: EnumGender;

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  dayOfBirth: string;

  @Column({ nullable: true })
  image: string; // Cloudinary URL

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
