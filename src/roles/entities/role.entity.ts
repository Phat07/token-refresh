
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}