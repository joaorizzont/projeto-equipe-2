import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'int', name: 'default_stock' })
  defaultStock!: number;

  @Column({ type: 'datetime', name: 'valid_at' })
  validAt!: Date;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl!: string | null;
}
