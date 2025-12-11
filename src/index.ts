import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth"
import itemRoutes from "./routes/item"
import sellerRoutes from "./routes/seller"
import adminRoutes from "./routes/admin"
import aiRoutes from "./routes/ai"
import { authenticate } from "./middleware/auth"

dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fontend-blog.vercel.app",
      "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"] // optional
  })
)

app.use("/api/v1/auth", authRoutes)

app.use("/api/v1/item", itemRoutes)

app.use("/api/v1/seller", authenticate, sellerRoutes)

app.use("/api/v1/admin", authenticate, adminRoutes)

app.use("/api/v1/ask", aiRoutes)



mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("DB connected")
    //auto crate super admin if not exists
    const { createSuperAdminIfNotExists } = await import('./utils/superAdmin');
    await createSuperAdminIfNotExists();
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

app.listen(PORT, () => {
  console.log("Server is running")
})