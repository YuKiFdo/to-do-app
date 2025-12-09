import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_completed: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'NOW()',
  })
  created_at: Date;
}

