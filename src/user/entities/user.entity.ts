import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ChurchNewsBoard } from 'src/church-news-boards/entities/church-news-board.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  hashedRefreshToken: string | null;

  @OneToMany(() => ChurchNewsBoard, (board) => board.author)
  boards: ChurchNewsBoard[];
}
