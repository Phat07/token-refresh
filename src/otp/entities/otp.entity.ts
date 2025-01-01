import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otpCode: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  email: string;  // Thêm trường để lưu email

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
