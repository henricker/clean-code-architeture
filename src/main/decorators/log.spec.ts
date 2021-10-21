import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface ISutType {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise((resolve) => resolve()) 
    }
  }

  return new LogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          name: 'any name',
          email: 'any mail',
          password: 'any password',
          passwordConfirmation: 'any password'
        }, 
        statusCode: 200
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makesut = (): ISutType => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makesut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any mail',
        password: 'any password',
        passwordConfirmation: 'any password'
      }
    }

    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)

    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  it('should call controller handle', async () => {
    const { sut } = makesut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any mail',
        password: 'any password',
        passwordConfirmation: 'any password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      body: {
        name: 'any name',
        email: 'any mail',
        password: 'any password',
        passwordConfirmation: 'any password'
      }, 
      statusCode: 200
    })
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makesut()
    
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockRejectedValue(error)
    
    const httpRequest: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any mail',
        password: 'any password',
        passwordConfirmation: 'any password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      body: {
        name: 'any name',
        email: 'any mail',
        password: 'any password',
        passwordConfirmation: 'any password'
      }, 
      statusCode: 200
    })
  })


})