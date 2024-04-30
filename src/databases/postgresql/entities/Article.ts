import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from "typeorm";
import Chat from "./Chat";

// Entidad de usuario
@Entity()
class Article {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column()
  article_url: string;

  @Column()
  article_summary: string;

  @OneToMany(() => Chat, (chat: Chat) => chat.article)
  chat: Chat[];

  // Timestamp of submission
  @Column()
  submission_date: Date;
}

export default Article;
