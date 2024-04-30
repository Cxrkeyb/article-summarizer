import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Stream } from "stream"; // Import Stream from "stream"

import logger from "@/logger";

// Config environment
import config from "@/config";
import morgan from "morgan";

import v1 from "@/web/modules/v1/router";

// Custom logger stream
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LoggerStream extends Stream.Writable {
  _write(chunk: any, encoding: string, callback: () => void) {
    logger.info(chunk.toString());
    callback();
  }
}

const ws = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

ws.use(cors(corsOptions));

// Permitir todas las peticiones para todas las rutas
ws.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Use morgan with the custom logger stream
ws.use(morgan("dev", { stream: new LoggerStream() }));

ws.use(express.json());

ws.use(cookieParser(config.web.cookieSecret));

ws.get("/", async (req, res) => {
  try {
    res.type("json").send(
      JSON.stringify(
        {
          status: "ON",
          time: new Date().toUTCString(),
          date: new Date().toISOString()
        },
        null,
        2
      )
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

ws.use("/v1", v1);

export default ws;
