import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Index, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import Chat from "./Chat";

// Entidad de usuario
@Entity()
class User {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column({ length: 30 })
  userName: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 60 }) // Longitud suficiente para almacenar la contraseña cifrada
  password: string;

  @Column({ nullable: true, type: "text" })
  refreshToken: string;

  @OneToMany(() => Chat, (chat: Chat) => chat.user)
  chat: Chat[];

  // Método para cifrar la contraseña antes de insertarla en la base de datos
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export default User;
