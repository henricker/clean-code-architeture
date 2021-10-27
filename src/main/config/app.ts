import setupMiddlewares from './middlewares'
import routes from './routes'
import express from 'express'

const app = express()
setupMiddlewares(app)
routes(app)
export default app