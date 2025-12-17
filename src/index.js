import express from "express";
import adminRoutes from './router/adminRouter.js'
import authRoutes from './router/authRouter.js'
import collectionRoutes from "./router/collectionRouter.js"
import logger from './middleware/logger.js'

const PORT = 3000;

const app = express()

app.use(express.json())
app.use(logger)

// Request -> express.json() -> Logger -> Controller -> Response

app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/collection', collectionRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})