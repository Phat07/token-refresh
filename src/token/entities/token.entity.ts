import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type:"text" })
  accessToken: string;

  @Column({ nullable: true, type:"text" })
  refreshToken: string;

  @Column()
  accessTokenExpiresAt: Date;

  @Column()
  refreshTokenExpiresAt: Date;

  @OneToOne(() => User, (user) => user.token)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}
