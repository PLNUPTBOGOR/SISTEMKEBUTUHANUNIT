
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import analyticsRouter from './route/analytics.route.js'

const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL, // dev frontend
  'https://sistem-kebutuhan-pln-sg1o.vercel.app' // deployed frontend
]

app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    // allow requests with no origin (like curl, postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  }
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan()) // untuk development
app.use(helmet({
  crossOriginResourcePolicy: false
}))

const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.json({
    message: "Server is running on port " + PORT
  })
})

app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)
app.use("/api/analytics", analyticsRouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
  })
})
