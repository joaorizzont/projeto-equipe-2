import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Ticket } from './Ticket';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'int', default: 0 })
  defaultStock!: number;

  @Column({ type: 'int', default: 0 })
  currentStock!: number;

  @Column({ type: 'timestamp' })
  validAt!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets!: Ticket[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;
}
