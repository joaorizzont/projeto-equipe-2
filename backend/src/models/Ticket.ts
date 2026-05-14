import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  ticketCode!: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.ATIVO })
  status!: TicketStatus;

  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @Column({ name: 'event_id', type: 'varchar' })
  eventId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Event, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
