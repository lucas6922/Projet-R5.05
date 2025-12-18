import express from "express";
import collectionRoutes from "./router/collectionRouter.js"
import authionRoutes from './router/authRouter.js'
import logger from './middleware/logger.js'
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

const swaggerDocument = JSON.parse(
  readFileSync('./src/swagger-output.json', 'utf-8')
);
const PORT = 3000;

const app = express()

app.use(express.json())
app.use(logger)

// Request -> express.json() -> Logger -> Controller -> Response

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/collection', collectionRoutes)
app.use('/auth', authionRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})