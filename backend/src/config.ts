import dotenv from "dotenv"

dotenv.config();
export const dbString = process.env.MONGO_URL ?? "";
export const secret = process.env.JWT_SECRET ?? "";