import * as dotenv from "dotenv";
dotenv.config({path: "dev.env"});
console.log("ENV : ", process.env.NODE_ENV);
import cookieParser from "cookie-parser";

import express, { Application } from 'express';
import connectDB from "./config/dbConfig";
import userRoutes from "./routes/userRoutes";
import rolesRotes from "./routes/rolesRoutes";
import memberRoutes from "./routes/memberRoutes";
import communityRoutes from "./routes/communityRoutes";
import checkAuth from "./middlewares/auth";

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
app.use(checkAuth);
app.use("/v1", rolesRotes);
app.use("/v1", memberRoutes);
app.use("/v1", communityRoutes);




app.get("*", (req, res) => {
  res.status(404).json({ message: "Page not found!" });
});


