import { Salon } from 'src/salon/entities/salon.entity';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    ManyToOne, 
    JoinColumn 
  } from 'typeorm';
@Entity('voucher')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column('decimal')
  discount: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  // Quan hệ với Salon
  @ManyToOne(() => Salon, salon => salon.vouchers)
  @JoinColumn({ name: 'salon_id' })
  salon: Salon;
}
