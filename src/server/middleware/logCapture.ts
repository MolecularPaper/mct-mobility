import { Request, Response, NextFunction } from "express";
import winston from "winston";
import { wrapConsole, restoreConsole } from "@/utils/console";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

export function logCaptureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestLogs: string[] = [];

  wrapConsole((level, args) => {
    const message = args.map(String).join(" ");

    switch (level) {
      case "error":
        logger.error(message);
        break;
      case "warn":
        logger.warn(message);
        break;
      default:
        logger.info(message);
        break;
    }
  });

  res.on("finish", () => {
    restoreConsole();
    // 요청 처리 중 발생한 로그를 헤더나 DB에 저장
    console.log(
      `Request ${req.method} ${req.path} captured ${requestLogs.length} logs`,
    );
  });

  next();
}
