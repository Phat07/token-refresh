import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Role } from 'src/roles/entities/role.entity';
import { v4 as uuidv4 } from 'uuid';
import { Token } from 'src/token/entities/token.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  // @Column({ nullable: true })
  // roleId: number;
  @Column({ unique: false, nullable: true, default: null })
  googleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  // @OneToOne(() => Token, token => token.user)
  // token: Token;
  // nếu bỏ eager thì nó sẽ không được tự động truy xuất

  @Exclude()
  @OneToOne(() => Token, (token) => token.user, { eager: true })
  token: Token;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  // Quan hệ với Salon (nếu user là salonOwner)
  // Quan hệ với các vai trò chi tiết
  @OneToOne(() => Owner, (owner) => owner.user, { nullable: true })
  owner: Owner;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee: Employee;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin: Admin;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    eager: true,
    nullable: true,
  })
  wallet: Wallet;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}
