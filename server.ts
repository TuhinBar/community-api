import * as dotenv from "dotenv";
dotenv.config({path: "dev.env"});
console.log("ENV : ", process.env.NODE_ENV);
import cookieParser from "cookie-parser";

import express, { Application } from 'express';
import connectDB from "./config/dbConfig";
import userRoutes from "./routes/userRoutes";
import rolesRotes from "./routes/rolesRoutes";

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser());

(async () => {
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
)();


// Routes
app.use("/v1", userRoutes);
app.use("/v1", rolesRotes);


