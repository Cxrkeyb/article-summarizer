import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from "typeorm";
import User from "./User";
import Article from "./Article";
import Message from "./Message";

// Entidad de usuario
@Entity()
class Chat {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @ManyToOne(() => User, (user: User) => user.chat)
  @JoinColumn({ name: "user_id" })
  user: User;

  // Relation with article
  @OneToOne(() => Article, (article: Article) => article.chat)
  @JoinColumn({ name: "article_id" })
  article: Article;

  @OneToMany(() => Message, (message: Message) => message.chat)
  @JoinColumn({ name: "message_id" })
  message: Message[];
}

export default Chat;
