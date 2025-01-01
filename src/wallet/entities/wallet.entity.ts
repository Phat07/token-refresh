import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null})
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generate a UUID before inserting the entity
  }
}
