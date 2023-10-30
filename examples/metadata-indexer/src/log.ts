import { pino } from "pino";

const LOG_LEVEL = process.env["LOG_LEVEL"] || "info";

export const log = pino({
  level: LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true,
    },
  },
});

export type Logger = pino.Logger;
