import { Request, Response, NextFunction } from 'express'

export const cors = (request: Request, response: Response, next: NextFunction): void => {
  response.set('access-controll-allow-origin', '*')
  response.set('access-controll-allow-methods', '*')
  response.set('access-controll-allow-headers', '*')
  next()
}