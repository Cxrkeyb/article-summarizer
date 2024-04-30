import { connection } from "..";
import { Article } from "@entities/index";

const articleRepository = connection.getRepository(Article);

export { articleRepository as ArticleRepository };
