import { connection } from "..";
import { User } from "@entities/index";

const userRepository = connection.getRepository(User);

export { userRepository as UserRepository };
