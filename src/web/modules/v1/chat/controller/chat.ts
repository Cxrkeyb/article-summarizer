import config from "@/config";
import {
  ArticleRepository,
  ChatRepository,
  MessageRepository,
  UserRepository
} from "@/databases/postgresql/repos";
import { Request, Response } from "express";
import openai from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

// Initialize OpenAI with API key
const openaiApi = new openai.OpenAI({ apiKey: config.openai.apiKey });

export const getArticleSummary = async (req: Request, res: Response) => {
  try {
    const user = await UserRepository.findOne({
      where: { id: req.body.jwtPayload.payload.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { url } = req.body;

    // Validate input data
    if (!url) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Request article summary
    const response = await openaiApi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "In a nutshell, what is this article about? Give me two paragraphs"
        },
        { role: "user", content: url }
      ]
    });

    // Extract summary from response
    const summary = response.choices[0].message.content;

    if (!summary) {
      return res.status(400).json({ message: "Error fetching article summary" });
    }

    // Save the article summary in the database
    const article = await ArticleRepository.insert({
      article_url: url,
      article_summary: summary,
      submission_date: new Date()
    });

    // Save the chat in the database
    const chat = await ChatRepository.insert({
      article: article.identifiers[0],
      user: {
        id: user.id
      }
    });

    // Save the meesage of the user in the database
    await MessageRepository.insert({
      chat: chat.identifiers[0],
      message: url,
      is_user: true,
      message_date: new Date()
    });

    // Save the message of the AI of the article in the database
    await MessageRepository.insert({
      chat: chat.identifiers[0],
      message: summary,
      is_user: false,
      message_date: new Date()
    });

    // Return the summary
    return res.json({ chatId: chat.identifiers[0], articleSummary: summary });
  } catch (error) {
    console.error("Error fetching article summary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnswerMessage = async (req: Request, res: Response) => {
  try {
    const user = await UserRepository.findOne({
      where: { id: req.body.jwtPayload.payload.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { message, chatId } = req.body;

    if (!message || !chatId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const chatFound = await ChatRepository.findOne({
      where: { id: chatId },
      relations: {
        message: true
      }
    });

    if (!chatFound) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // get messages from the chat with the structure of the AI
    const messages: ChatCompletionMessageParam[] = chatFound.message.map((m) => ({
      role: m.is_user ? "user" : "system",
      content: m.message
    }));

    // Add the new message of the user to the messages
    messages.push({
      role: "user",
      content: message
    });

    // Request AI response
    const response = await openaiApi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });

    // Extract response from the AI
    const answer = response.choices[0].message.content;

    if (!answer) {
      return res.status(400).json({ message: "Error fetching response" });
    }

    // Save the message of the user in the database
    await MessageRepository.insert({
      chat: chatId,
      message,
      is_user: true,
      message_date: new Date()
    });

    // Save the message of the AI in the database
    await MessageRepository.insert({
      chat: chatId,
      message: answer,
      is_user: false,
      message_date: new Date()
    });

    // Get the chat with the messages
    const chat = await ChatRepository.findOne({
      where: { id: chatId },
      relations: {
        article: true,
        message: true
      }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const chatSummary = {
      chatId: chat.id,
      articleSummary: chat.article.article_summary,
      messages: chat.message.map((m) => ({
        message: m.message,
        isUser: m.is_user,
        messageDate: m.message_date
      }))
    };

    return res.json({ chatSummary });
  } catch (error) {
    console.error("Error fetching response:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const user = await UserRepository.findOne({
      where: { id: req.body.jwtPayload.payload.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chats = await ChatRepository.find({
      where: { user: { id: user.id } },
      relations: {
        article: true
      }
    });

    if (!chats) {
      return res.status(404).json({ message: "Chats not found" });
    }

    // Array with chat id and article summary
    const chatSummary = chats.map((chat) => ({
      chatId: chat.id,
      articleSummary: chat.article.article_summary
    }));

    // Return array inverse
    chatSummary.reverse();

    return res.json({ chatSummary });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatHistoryById = async (req: Request, res: Response) => {
  try {
    const user = await UserRepository.findOne({
      where: { id: req.body.jwtPayload.payload.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chat = await ChatRepository.findOne({
      where: { id: req.params.id },
      relations: {
        article: true,
        message: true
      }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const chatSummary = {
      chatId: chat.id,
      articleSummary: chat.article.article_summary,
      messages: chat.message.map((m) => ({
        message: m.message,
        isUser: m.is_user,
        messageDate: m.message_date
      }))
    };

    return res.json({ chatSummary });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
