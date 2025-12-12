import express from "express";
import collectionRoutes from "./router/collectionRouter.js"
import authionRoutes from './router/authRouter.js'
import logger from './middleware/logger.js'

const PORT = 3000;

const app = express()

app.use(express.json())
app.use(logger)

// Request -> express.json() -> Logger -> Controller -> Response

app.use('/collection', collectionRoutes)
app.use('/auth', authionRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})