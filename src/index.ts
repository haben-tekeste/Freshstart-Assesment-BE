import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { errorHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port " + process.env.PORT);
});
