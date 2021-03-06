import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRouter = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      accountId: request['accountId'],
      headers: request.headers
    } 

    const httpResponse = await controller.handle(httpRequest)
    if(httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299)
      response.status(httpResponse.statusCode).json(httpResponse.body)
    else
      response.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
  }  
}