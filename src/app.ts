import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import cron from 'node-cron';
import autoDeleteAssignment from "./app/utils/autoDeleteAssignment";

const app: Application = express();


app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://review-system-frontend-inky.vercel.app"
    ],
    credentials: true, 
  })
);


app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send(`Server Running on port ${config.port}`);
});

cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to delete expired assignments...');
  await autoDeleteAssignment();
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;

//docker build command 
/* 
1. docker-compose down
2. docker-compose up --build -d
3. docker-compose logs -f backend
*/

// radis 

/* docker stop ts_express_redis
docker start ts_express_redis */

// radis run docker run -d --name ts_express_redis -p 6379:6379 redis:7-alpine