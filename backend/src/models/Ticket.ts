import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

export enum TicketStatus {
  ATIVO = 'ativo',
  UTILIZADO = 'utilizado',
  CANCELADO = 'cancelado',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, unique: true, nullable: false })
  codigoIngresso!: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ATIVO,
  })
  status!: TicketStatus;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'event_id' })
  eventId!: string;

  @ManyToOne(() => User, (user) => user.tickets, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Event, (event) => event.tickets, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
