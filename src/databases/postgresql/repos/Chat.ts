import { connection } from "..";
import { Chat } from "@entities/index";

const chatRepository = connection.getRepository(Chat);

export { chatRepository as ChatRepository };
