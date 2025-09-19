import dotenv from "dotenv"
import express from "express"
import routes from "./routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", routes)

app.listen(3000);