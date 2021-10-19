import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  it('should enable CORS', async () => {
    app.post('/test_cors', (request, response) => {
      response.send()
    })
  
    const response = await request(app)
      .post('/test_cors')

    expect(response.headers['access-controll-allow-origin']).toBe('*')
    expect(response.headers['access-controll-allow-methods']).toBe('*')
    expect(response.headers['access-controll-allow-headers']).toBe('*')
  })
})