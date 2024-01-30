import express, { Request, Response } from "express";
import { IndexerQueue } from "./indexerQueue";
import { rateLimit } from "express-rate-limit";

export class Server {
  private app: express.Application;

  constructor(private indexerQueue: IndexerQueue) {
    this.app = express();
    this.configuration();
    this.routes();
  }

  public configuration() {
    this.app.set("port", process.env["PORT"] || 3000);
  }

  private routes() {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
    this.app.use(limiter);

    // POST endpoint at /refresh
    this.app.post("/refresh", (req: Request, res: Response) => {
      // Extracting the 'url' query parameter
      const url = req.query["url"] as string;
      if (url) {
        // URL-decoding the 'url' parameter
        const decodedUrl = decodeURIComponent(url);

        this.indexerQueue.push(decodedUrl, { force: true });

        res.status(200).send({ message: "URL received", url: decodedUrl });
      } else {
        res.status(400).send({ message: "URL parameter is missing" });
      }
    });
  }

  public start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server is listening on port ${this.app.get("port")}`);
    });
  }
}
