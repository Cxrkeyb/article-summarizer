import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, ManyToOne } from "typeorm";
import Chat from "./Chat";

// Entidad de usuario
@Entity()
class Message {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column()
  message: string;

  @Column()
  message_date: Date;

  @Column()
  is_user: boolean;

  // relations to chat id
  @ManyToOne(() => Chat, (chat: Chat) => chat.message)
  @JoinColumn({ name: "chat_id" })
  chat: Chat;
}

export default Message;
