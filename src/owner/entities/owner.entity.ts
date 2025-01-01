import { EnumGender } from 'src/employee/enums/gender.enum';
import { Salon } from 'src/salon/entities/salon.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Quan hệ với User
  @OneToOne(() => User, (user) => user.owner)
  @JoinColumn({ name: 'userId' }) // Cột userId
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

  @Column({ nullable: true })
  address: string; // Cloudinary URL

  // Quan hệ với Salon
  @OneToMany(() => Salon, (salon) => salon.owner)
  salons: Salon[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
