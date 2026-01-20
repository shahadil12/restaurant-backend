import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';

@Entity('payment_method')
export class PaymentMethod extends BaseEntity {

  @Column({ name: 'payment_name', unique: true })
  @IsString()
  @IsNotEmpty()
  paymentName: string;

  @Column({ name: 'payment_code', unique: true })
  @IsString()
  @IsNotEmpty()
  paymentCode: string;

  @Column({ type:'json' })
  @IsString()
  @IsNotEmpty()
  details: string;
}
