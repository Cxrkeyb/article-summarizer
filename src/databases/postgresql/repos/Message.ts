import { connection } from "..";
import { Message } from "@entities/index";

const messageRepository = connection.getRepository(Message);

export { messageRepository as MessageRepository };
