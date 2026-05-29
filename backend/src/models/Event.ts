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

  @Column({ type: 'timestamp', nullable: true })
  endAt!: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  format!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value?: number) => value ?? 0,
      from: (value: string | null) => (value === null ? 0 : Number(value)),
    },
  })
  price!: number;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets!: Ticket[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;
}
